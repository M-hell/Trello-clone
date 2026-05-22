export function cloneBoard(board) {
  return {
    cards: board.cards.map((card) => ({ ...card, tasks: [...(card.tasks || [])] })),
    unassigned: [...board.unassigned],
  };
}

export function findTaskLocation(board, taskId) {
  const unassignedIndex = board.unassigned.findIndex((task) => task.id === taskId);
  if (unassignedIndex >= 0) {
    return { containerId: "unassigned", index: unassignedIndex };
  }

  for (const card of board.cards) {
    const taskIndex = (card.tasks || []).findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      return { containerId: `card-${card.id}`, index: taskIndex, cardId: card.id };
    }
  }

  return null;
}

export function getTaskFromBoard(board, taskId) {
  for (const task of board.unassigned) {
    if (task.id === taskId) {
      return task;
    }
  }

  for (const card of board.cards) {
    const foundTask = (card.tasks || []).find((task) => task.id === taskId);
    if (foundTask) {
      return foundTask;
    }
  }

  return null;
}

export function removeTask(board, taskId) {
  const nextBoard = cloneBoard(board);
  nextBoard.unassigned = nextBoard.unassigned.filter((task) => task.id !== taskId);
  nextBoard.cards = nextBoard.cards.map((card) => ({
    ...card,
    tasks: (card.tasks || []).filter((task) => task.id !== taskId),
  }));
  return nextBoard;
}

export function insertTask(board, task, containerId, index) {
  const nextBoard = removeTask(board, task.id);
  if (containerId === "unassigned") {
    const target = [...nextBoard.unassigned];
    const safeIndex = typeof index === "number" ? Math.max(0, Math.min(index, target.length)) : target.length;
    target.splice(safeIndex, 0, task);
    nextBoard.unassigned = target;
    return nextBoard;
  }

  const cardId = Number(containerId.replace("card-", ""));
  nextBoard.cards = nextBoard.cards.map((card) => {
    if (card.id !== cardId) {
      return card;
    }

    const tasks = [...(card.tasks || [])];
    const safeIndex = typeof index === "number" ? Math.max(0, Math.min(index, tasks.length)) : tasks.length;
    tasks.splice(safeIndex, 0, task);
    return { ...card, tasks };
  });

  return nextBoard;
}

export function moveTaskWithinContainer(board, taskId, containerId, fromIndex, toIndex) {
  const nextBoard = cloneBoard(board);

  if (containerId === "unassigned") {
    const tasks = [...nextBoard.unassigned];
    const [movedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedTask);
    nextBoard.unassigned = tasks;
    return nextBoard;
  }

  const cardId = Number(containerId.replace("card-", ""));
  nextBoard.cards = nextBoard.cards.map((card) => {
    if (card.id !== cardId) {
      return card;
    }

    const tasks = [...(card.tasks || [])];
    const [movedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedTask);
    return { ...card, tasks };
  });

  return nextBoard;
}