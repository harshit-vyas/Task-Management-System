import React, { useEffect, useState } from "react";
import {
  deleteTask,
  markDone,
  markPending,
  retrieveAllTasks,
} from "../service/TaskApiService";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaPen, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/tasks.css";

const TasksComponent = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = () => {
    retrieveAllTasks(userId)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const updateTask = (id) => navigate(`/update-task/${id}`);

  const deleteTaskFun = (id) => {
    deleteTask(id)
      .then(() => {
        fetchTasks();
        toast.success("Task deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      });
  };

  const markTask = (id, isChecked) => {
    const action = isChecked ? markDone : markPending;
    action(id)
      .then(() => {
        fetchTasks();
        toast.success(`Task marked as ${isChecked ? "completed" : "pending"}`);
      })
      .catch((error) => {
        console.error(`Error marking task as ${isChecked ? "completed" : "pending"}:`, error);
        toast.error(`Failed to mark task as ${isChecked ? "completed" : "pending"}`);
      });
  };

  const viewTaskDetails = (task) => {
    navigate(`/task-details/${task.id}`, { state: task });
  };

  // Filter tasks into two categories: active and completed
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Task List (Active Tasks) */}
          <div className="card shadow-lg mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Task List</h2>
                <Link to="/add-task" className="btn btn-primary btn-sm">
                  <FaPlus className="me-2" /> Add Task
                </Link>
              </div>

              {/* Only render active (in-progress) tasks */}
              {activeTasks.map((task) => (
                <div key={task.id} className="mb-4 task-card">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-end gap-2 mb-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => viewTaskDetails(task)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
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
                      <h5 className="task-title">{task.task}</h5>
                      <p className="task-details">Details: {task.details}</p>
                      <p className="task-date">
                        Created At: {new Date(task.taskCreatedAt).toLocaleString()}
                      </p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => markTask(task.id, e.target.checked)}
                        />
                        <label className="form-check-label">Mark as Complete</label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default TasksComponent;
