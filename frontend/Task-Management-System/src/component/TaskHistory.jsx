import { useEffect, useState } from "react";
import {
  deleteTask,
  markDone,
  markPending,
  retrieveAllTasks,
} from "../service/TaskApiService";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPen, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import "../css/tasks.css";

const TaskHistory = ({ userId }) => {
  console.log("User ID in TaskHistory component:", userId);

  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      console.log("Fetching all tasks for user ID:", userId);
      allTasks(userId);
    } else {
      console.warn("User ID is missing in TaskHistory component!");
    }
  }, [userId]); // Dependency on userId ensures tasks are fetched when it changes

  const allTasks = (userId) => {
    console.log("allTasks function called with user ID:", userId);
    retrieveAllTasks(userId)
      .then((response) => {
        console.log("Tasks retrieved successfully:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error retrieving tasks:", error);
      });
  };

  const viewTaskDetails = (task) => {
    console.log("Navigating to view task details for task:", task);
    navigate(`/task-details/${task.id}`, { state: task });
  };

  const updateTask = (id) => {
    console.log("Navigating to update task with ID:", id);
    navigate(`/update-task/${id}`);
  };

  const deleteTaskFun = (id) => {
    console.log("Deleting task with ID:", id);
    deleteTask(id)
      .then(() => {
        console.log("Task deleted successfully. Refreshing task list...");
        allTasks(userId);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const markTask = (id, isChecked) => {
    console.log(
      `Marking task with ID: ${id} as ${isChecked ? "completed" : "pending"}`
    );
    if (isChecked) {
      markDone(id)
        .then((response) => {
          console.log("Task marked as completed:", response.data);
          allTasks(userId);
        })
        .catch((error) => {
          console.error("Error marking task as completed:", error);
        });
    } else {
      markPending(id)
        .then((response) => {
          console.log("Task marked as pending:", response.data);
          allTasks(userId);
        })
        .catch((error) => {
          console.error("Error marking task as pending:", error);
        });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Task History</h2>
                <Link to="/add-task" className="btn btn-primary btn-sm">
                  <i className="fas fa-plus me-2"></i> Add Task
                </Link>
              </div>
              {tasks.map(
                (task) =>
                  task.completed && (
                    <div key={task.id} className="card mb-4">
                      <div className="card-body">
                        <div className="d-flex justify-content-end gap-2 mb-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewTaskDetails(task)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateTask(task.id)}
                          >
                            <FaPen />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteTaskFun(task.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              checked={task.completed}
                              onChange={(e) =>
                                markTask(task.id, e.target.checked)
                              }
                              type="checkbox"
                            />
                          </div>
                          <div
                            className={`${
                              task.completed
                                ? "text-decoration-line-through text-muted"
                                : ""
                            }`}
                          >
                            <strong>{task.task}</strong>
                          </div>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            Created: {task.taskCreatedAt}
                          </small>
                          <div>
                            {task.completed ? (
                              <FaCheck className="text-success" />
                            ) : (
                              <FaTimes className="text-danger" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
