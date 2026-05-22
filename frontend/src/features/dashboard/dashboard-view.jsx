"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CardColumn from "@/components/cards/card-column";
import CardFormModal from "@/components/cards/card-form-modal";
import CopyCardModal from "@/components/cards/copy-card-modal";
import DashboardShell from "@/components/layout/dashboard-shell";
import SidebarPanel from "@/components/layout/sidebar-panel";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import TaskDetailModal from "@/components/tasks/task-detail-modal";
import TaskFormModal from "@/components/tasks/task-form-modal";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import { clearAuthState, selectAuthUser } from "@/store/slices/auth-slice";
import { createCardThunk, copyCardThunk, deleteCardThunk, fetchCards, selectCards, selectCardsStatus, updateCardThunk } from "@/store/slices/cards-slice";
import { createTaskThunk, detachTaskThunk, fetchAllTasks, fetchUnassignedTasks, hardDeleteTaskThunk, selectAllTasks, selectTasksStatus, selectUnassignedTasks, updateTaskThunk } from "@/store/slices/tasks-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { findTaskLocation, getTaskFromBoard, insertTask, moveTaskWithinContainer } from "@/features/dashboard/board-utils";

const initialModalState = {
  cardForm: false,
  taskForm: false,
  copyCard: false,
  taskDetail: false,
};

export default function DashboardView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const cards = useAppSelector(selectCards);
  const unassignedTasks = useAppSelector(selectUnassignedTasks);
  const allTasks = useAppSelector(selectAllTasks);
  const cardsStatus = useAppSelector(selectCardsStatus);
  const tasksStatus = useAppSelector(selectTasksStatus);

  const [board, setBoard] = useState({ cards: [], unassigned: [] });
  const [search, setSearch] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [modalState, setModalState] = useState(initialModalState);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [targetCardId, setTargetCardId] = useState(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, kind: null, item: null });
  const [hasMounted, setHasMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    void refreshBoard();
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setBoard({ cards: cards || [], unassigned: unassignedTasks || [] });
  }, [cards, unassignedTasks]);

  const filteredUnassigned = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return board.unassigned;
    }

    return board.unassigned.filter((task) => {
      const searchableValue = `${task.task_title || ""} ${task.task_description || ""}`.toLowerCase();
      return searchableValue.includes(query);
    });
  }, [board.unassigned, search]);

  const combinedTaskCount = allTasks?.length || 0;

  const openTaskForm = (task = null, cardId = null) => {
    setSelectedTask(task);
    setTargetCardId(cardId);
    setModalState((current) => ({ ...current, taskForm: true }));
  };

  const openCardForm = (card = null) => {
    setSelectedCard(card);
    setModalState((current) => ({ ...current, cardForm: true }));
  };

  const openCopyCard = (card) => {
    setSelectedCard(card);
    setModalState((current) => ({ ...current, copyCard: true }));
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setModalState((current) => ({ ...current, taskDetail: true }));
  };

  const closeModals = () => {
    setModalState(initialModalState);
    setSelectedCard(null);
    setSelectedTask(null);
    setTargetCardId(null);
  };

  const openDeleteDialog = (kind, item) => {
    setDeleteDialog({ open: true, kind, item });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, kind: null, item: null });
  };

  const isForbiddenResult = (result) => result?.type?.endsWith("/rejected") && result?.payload?.status === 403;

  const handleForbidden = (results) => {
    if (results.some(isForbiddenResult)) {
      dispatch(clearAuthState());
      router.replace("/login");
      return true;
    }

    return false;
  };

  const refreshBoard = async () => {
    const results = await Promise.all([dispatch(fetchCards()), dispatch(fetchUnassignedTasks()), dispatch(fetchAllTasks())]);
    return !handleForbidden(results);
  };

  const handleCardSubmit = async (values) => {
    setMutationLoading(true);
    try {
      const payload = {
        card_name: values.card_name,
        due_date: values.due_date || null,
        tags: values.tags || null,
      };

      if (selectedCard) {
        const result = await dispatch(updateCardThunk({ cardId: selectedCard.id, payload }));
        if (updateCardThunk.fulfilled.match(result)) {
          toast.success("Card updated.");
        }
      } else {
        const result = await dispatch(createCardThunk(payload));
        if (createCardThunk.fulfilled.match(result)) {
          toast.success("Card created.");
        }
      }

      const refreshed = await refreshBoard();
      if (!refreshed) {
        return;
      }
      closeModals();
    } finally {
      setMutationLoading(false);
    }
  };

  const handleTaskSubmit = async (values) => {
    setMutationLoading(true);
    try {
      const payload = {
        task_title: values.task_title,
        task_description: values.task_description || null,
        task_file_url: values.task_file_url || null,
        status: values.status || "open",
      };

      if (selectedTask?.id) {
        const result = await dispatch(updateTaskThunk({ taskId: selectedTask.id, payload }));
        if (updateTaskThunk.fulfilled.match(result)) {
          toast.success("Task updated.");
        }
      } else {
        const createdResult = await dispatch(createTaskThunk(payload));
        if (createTaskThunk.fulfilled.match(createdResult)) {
          const createdTask = createdResult.payload;
          toast.success("Task created.");

          if (targetCardId && createdTask?.id) {
            await dispatch(updateTaskThunk({ taskId: createdTask.id, payload: { card_id: targetCardId } }));
          }
        }
      }

      const refreshed = await refreshBoard();
      if (!refreshed) {
        return;
      }
      closeModals();
    } finally {
      setMutationLoading(false);
    }
  };

  const handleCopyCard = async (payload) => {
    setMutationLoading(true);
    try {
      const result = await dispatch(copyCardThunk(payload));
      if (copyCardThunk.fulfilled.match(result)) {
        toast.success(result.payload?.message || "Card copied successfully.");
        const refreshed = await refreshBoard();
        if (!refreshed) {
          return;
        }
        closeModals();
      }
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteCard = async (card) => {
    openDeleteDialog("card", card);
  };

  const handleDeleteTask = async (task) => {
    openDeleteDialog("task", task);
  };

  const handleDetachTask = async (task) => {
    setMutationLoading(true);
    try {
      const result = await dispatch(detachTaskThunk(task.id));
      if (detachTaskThunk.fulfilled.match(result)) {
        toast.success("Task unassigned.");
        const refreshed = await refreshBoard();
        if (!refreshed) {
          return;
        }
        closeModals();
      }
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDragStart = ({ active }) => {
    const task = active.data.current?.task;
    setActiveTask(task || null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) {
      return;
    }

    const activeTaskId = Number(active.id.toString().replace("task-", ""));
    const activeLocation = findTaskLocation(board, activeTaskId);
    const activeTaskData = getTaskFromBoard(board, activeTaskId);

    if (!activeLocation || !activeTaskData) {
      return;
    }

    const overTaskId = typeof over.id === "string" && over.id.startsWith("task-") ? Number(over.id.replace("task-", "")) : null;
    const destinationLocation = overTaskId
      ? findTaskLocation(board, overTaskId)
      : {
          containerId: over.data.current?.containerId || over.id,
          index: null,
        };

    if (!destinationLocation) {
      return;
    }

    if (activeLocation.containerId === destinationLocation.containerId && activeLocation.index === destinationLocation.index) {
      return;
    }

    if (activeLocation.containerId === destinationLocation.containerId && overTaskId !== null) {
      setBoard((current) => moveTaskWithinContainer(current, activeTaskId, activeLocation.containerId, activeLocation.index, destinationLocation.index));
      return;
    }

    setBoard((current) => insertTask(current, activeTaskData, destinationLocation.containerId, destinationLocation.index ?? undefined));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeTaskId = Number(active.id.toString().replace("task-", ""));
    const activeLocation = findTaskLocation(board, activeTaskId);
    const activeTaskData = getTaskFromBoard(board, activeTaskId);
    if (!activeLocation || !activeTaskData) {
      return;
    }

    const overTaskId = typeof over.id === "string" && over.id.startsWith("task-") ? Number(over.id.replace("task-", "")) : null;
    const destinationLocation = overTaskId
      ? findTaskLocation(board, overTaskId)
      : {
          containerId: over.data.current?.containerId || over.id,
          index: null,
        };

    if (!destinationLocation) {
      return;
    }

    try {
      if (destinationLocation.containerId === "unassigned") {
        await dispatch(detachTaskThunk(activeTaskId));
      } else {
        const cardId = Number(destinationLocation.containerId.replace("card-", ""));
        await dispatch(updateTaskThunk({ taskId: activeTaskId, payload: { card_id: cardId } }));
      }

      const refreshed = await refreshBoard();
      if (!refreshed) {
        return;
      }
      toast.success("Task moved.");
    } catch {
      toast.error("Unable to move task.");
      setBoard({ cards, unassigned: unassignedTasks });
    }
  };

  const mainCards = useMemo(() => board.cards || [], [board.cards]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <DashboardShell
        sidebar={
          <SidebarPanel
            search={search}
            onSearch={setSearch}
            onCreateTask={() => openTaskForm()}
            tasks={filteredUnassigned}
            onOpenTask={openTaskDetail}
          />
        }
      >
        <div className="flex h-full min-h-[calc(100vh-7rem)] flex-col gap-5">
          <CardHeader
            userName={hasMounted ? user?.name : ""}
            totalTasks={combinedTaskCount}
            onCreateCard={() => openCardForm()}
            loading={cardsStatus === "loading" || tasksStatus === "loading"}
          />

          <div className="min-h-0 flex-1 overflow-hidden rounded-4xl border border-white/70 bg-white/70 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:p-5">
            {cardsStatus === "loading" && !mainCards.length ? <BoardSkeleton /> : null}
            {!mainCards.length && cardsStatus !== "loading" ? (
              <EmptyState
                title="No cards yet"
                description="Create your first column to organize tasks, then drag items from the sidebar into a card."
                action={<Button onClick={() => openCardForm()}>Create card</Button>}
              />
            ) : (
              <div className="thin-scrollbar flex h-full gap-4 overflow-x-auto pb-2 pr-1">
                {mainCards.map((card) => (
                  <CardColumn
                    key={card.id}
                    card={card}
                    tasks={board.cards.find((entry) => entry.id === card.id)?.tasks || card.tasks || []}
                    onOpenTask={openTaskDetail}
                    onAddTask={(cardEntry) => openTaskForm(null, cardEntry.id)}
                    onEditCard={openCardForm}
                    onDeleteCard={handleDeleteCard}
                    onCopyCard={openCopyCard}
                  />
                ))}

                {mainCards.length ? (
                  <button
                    type="button"
                    className="flex h-128 w-[18rem] min-w-[18rem] items-center justify-center rounded-[28px] border border-dashed border-orange-200 bg-orange-50/60 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                    onClick={() => openCardForm()}
                  >
                    + New column
                  </button>
                ) : null}

              </div>
            )}
          </div>
        </div>

        <CardFormModal
          open={modalState.cardForm}
          onClose={closeModals}
          onSubmit={handleCardSubmit}
          initialValues={selectedCard}
          loading={mutationLoading}
          title={selectedCard ? "Edit card" : "Create card"}
        />

        <TaskFormModal
          open={modalState.taskForm}
          onClose={closeModals}
          onSubmit={handleTaskSubmit}
          initialValues={selectedTask}
          loading={mutationLoading}
          title={selectedTask?.id ? "Edit task" : "Create task"}
          description={targetCardId ? `This task will be assigned to card #${targetCardId} after creation.` : "Create a new unassigned task or update an existing one."}
        />

        <CopyCardModal
          open={modalState.copyCard}
          onClose={closeModals}
          card={selectedCard}
          onSubmit={handleCopyCard}
          loading={mutationLoading}
        />

        <TaskDetailModal
          open={modalState.taskDetail}
          task={selectedTask}
          onClose={closeModals}
          onEdit={(task) => {
            setSelectedTask(task);
            setModalState((current) => ({ ...current, taskDetail: false, taskForm: true }));
          }}
          onDelete={handleDeleteTask}
          onDetach={handleDetachTask}
        />

        <ConfirmDialog
          open={deleteDialog.open}
          title={deleteDialog.kind === "card" ? `Delete ${deleteDialog.item?.card_name || "card"}?` : `Delete ${deleteDialog.item?.task_title || "task"}?`}
          description={
            deleteDialog.kind === "card"
              ? "This will remove the column and all tasks assigned to it."
              : "This will permanently delete the task from your workspace."
          }
          confirmLabel={mutationLoading ? "Working..." : "Delete"}
          loading={mutationLoading}
          onClose={closeDeleteDialog}
          onConfirm={async () => {
            if (!deleteDialog.item) {
              return;
            }

            setMutationLoading(true);
            try {
              if (deleteDialog.kind === "card") {
                const result = await dispatch(deleteCardThunk(deleteDialog.item.id));
                if (deleteCardThunk.fulfilled.match(result)) {
                  toast.success("Card deleted.");
                  const refreshed = await refreshBoard();
                  if (!refreshed) {
                    return;
                  }
                  closeModals();
                }
              } else {
                const result = await dispatch(hardDeleteTaskThunk(deleteDialog.item.id));
                if (hardDeleteTaskThunk.fulfilled.match(result)) {
                  toast.success("Task deleted.");
                  const refreshed = await refreshBoard();
                  if (!refreshed) {
                    return;
                  }
                  closeModals();
                }
              }
            } finally {
              setMutationLoading(false);
              closeDeleteDialog();
            }
          }}
        />
      </DashboardShell>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-[18rem] rotate-2 opacity-95">
            <TaskPreview task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function CardHeader({ userName, totalTasks, onCreateCard, loading }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-1">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600/80">Dashboard</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950" suppressHydrationWarning>
          Welcome{userName ? `, ${userName}` : ""}.
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Boards are driven by the live backend state. Drag tasks from the inbox, open details, copy columns, and keep everything in sync.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="glass-panel rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700">{loading ? "Loading..." : `${totalTasks} tasks`}</div>
        <Button onClick={onCreateCard}>Create card</Button>
      </div>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="min-w-[20rem] rounded-[28px] border border-white/70 bg-white/80 p-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-4 h-64 w-full rounded-[22px]" />
        </div>
      ))}
    </div>
  );
}

function TaskPreview({ task }) {
  return (
    <div className="glass-panel rounded-3xl p-4 shadow-[0_28px_60px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600/80">Dragging</p>
          <h4 className="mt-2 text-sm font-semibold text-slate-950">{task.task_title || "Untitled task"}</h4>
        </div>
        <div className="h-3 w-3 rounded-full bg-orange-500" />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{task.task_description || "Drop this into a card."}</p>
    </div>
  );
}