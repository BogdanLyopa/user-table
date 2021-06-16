import { useState, useCallback } from "react";
import Modal from "./components/Modal/Modal";
import Table from "./components/Table/Table";
import Filter from "./components/Filter/Filter";
import users from "./db.json";

const DEFAULT_ARRAY = ["id", "FirstName", "LastName"];

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(DEFAULT_ARRAY);
  const [boards, setBoards] = useState([
    { id: 1, items: users[0] && Object.keys(users[0]) },
    { id: 2, items: [] },
  ]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [filter, setFilter] = useState("");

  const getVisibleItems = () => {
    return boards[0].items.filter((key) =>
      key.toLowerCase().includes(filter.toLowerCase())
    );
  };
  const visibleItems = getVisibleItems();
  const changeFilter = (event) => setFilter(event.target.value);
  const dragOverHandler = (event) => {
    event.preventDefault();
    if (event.target.className === "item") {
      event.target.style.boxShadow = "0 4px 3px gray";
    }
  };

  const dragLeaveHandler = (event) => {
    event.target.style.boxShadow = "none";
  };

  const dragStartHandler = (event, board, item) => {
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const dragEndHandler = (event) => {
    event.preventDefault();
    event.target.style.boxShadow = "none";
  };
  const dropHandler = (event, board, item) => {
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    const dropIndex = board.items.indexOf(item);
    board.items.splice(dropIndex + 1, 0, currentItem);
    setBoards(
      boards.map((b) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return currentBoard;
        }
        return b;
      })
    );
    event.target.style.boxShadow = "none";
  };

  const dropCardHandler = (event, board) => {
    event.preventDefault();
    board.items.push(currentItem);
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    setBoards(
      boards.map((b) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return currentBoard;
        }
        return b;
      })
    );
  };

  const toggleModal = useCallback(() => {
    setShowModal((prevShowModal) => !prevShowModal);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSelectedItems(boards[1].items);
    toggleModal();
  };

  const handleDelete = (board, item) => {
    boards[0].items.push(item);
    const currentIndex = board.items.indexOf(item);
    board.items.splice(currentIndex, 1);
    setBoards(
      boards.map((b) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return currentBoard;
        }
        return b;
      })
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>User Table</h1>
        <button className="button" type="button" onClick={toggleModal}>
          Select Grid Colums
        </button>
      </div>
      <Table items={selectedItems} />
      {showModal && (
        <Modal onCloseModal={toggleModal}>
          <div className="app">
            <h2>Select colums for the grid</h2>
            <Filter changeFilter={changeFilter} filter={filter} />

            <form onSubmit={handleSubmit}>
              <div
                className="board board-left"
                onDragOver={(event) => dragOverHandler(event)}
                onDrop={(event) => dropCardHandler(event, boards[0])}
              >
                {visibleItems.map((item, index) => (
                  <div
                    key={index}
                    onDragOver={(event) => dragOverHandler(event)}
                    onDragLeave={(event) => dragLeaveHandler(event)}
                    onDragStart={(event) =>
                      dragStartHandler(event, boards[0], item)
                    }
                    onDragEnd={(event) => dragEndHandler(event)}
                    onDrop={(event) => dropHandler(event, boards[0], item)}
                    className="item"
                    draggable={true}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                className="board"
                onDragOver={(event) => dragOverHandler(event)}
                onDrop={(event) => dropCardHandler(event, boards[1])}
              >
                {boards[1].items.map((item, index) => (
                  <div className="item" key={index}>
                    {item}
                    <button
                      className="button-delete"
                      type="button"
                      onClick={() => handleDelete(boards[1], item)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button className="button" type="submit">
                Aply
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
