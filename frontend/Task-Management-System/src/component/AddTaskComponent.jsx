import { useEffect, useState } from "react";
import { createTask, retrieveTaskById, updateTask } from "../service/TaskApiService";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaTasks } from "react-icons/fa";

const AddTaskComponent = ({ userId }) => {
  const [task, setTask] = useState("");
  const [details, setDetails] = useState(""); // New state for details
  const [completed, setCompleted] = useState(false);
  const taskCreatedAt = new Date().toISOString();
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ task: "", details: "" }); // Updated error state

  useEffect(() => {
    console.log("Component mounted or id changed. Task ID:", id);
    if (id) {
      retrieveTaskById(id)
        .then((response) => {
          console.log("Task retrieved successfully:", response.data);
          setTask(response.data.object.task);
          setDetails(response.data.object.details); // Set details from API
          setCompleted(response.data.object.completed);
        })
        .catch((error) => {
          console.error("Error retrieving task:", error);
        });
    }
  }, [id]);

  function saveTask(event) {
    event.preventDefault();
    console.log("Save task button clicked. Validating form...");
    if (validateForm()) {
      const taskObj = {
        task,
        details,
        completed,
        taskCreatedAt,
        updatedAt: new Date().toISOString(),
      };
      console.log("Task object to be saved:", taskObj);

      if (id) {
        console.log("Updating existing task with ID:", id);
        updateTask(taskObj, id)
          .then(() => {
            console.log("Task updated successfully. Redirecting to /tasks...");
            navigate("/tasks");
          })
          .catch((error) => {
            console.error("Error updating task:", error);
          });
      } else {
        console.log("Creating new task for user ID:", userId);
        createTask(taskObj, userId)
          .then(() => {
            console.log("Task created successfully. Redirecting to /tasks...");
            navigate("/tasks");
          })
          .catch((error) => {
            console.error("Error creating task:", error);
          });
      }
    } else {
      console.log("Form validation failed. Errors:", errors);
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };
    if (task.trim()) {
      errorsCopy.task = "";
    } else {
      errorsCopy.task = "Task field is required";
      valid = false;
    }

    if (details.trim()) {
      errorsCopy.details = "";
    } else {
      errorsCopy.details = "Details field is required";
      valid = false;
    }

    setErrors(errorsCopy);
    console.log("Form validation result:", valid, "Errors:", errorsCopy);
    return valid;
  }

  function AddUpdateText() {
    return id ? "Update" : "Add";
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow rounded-lg">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaTasks className="mr-3 text-primary" size={32} />
                  <h2 className="m-0">{AddUpdateText()} Task</h2>
                </div>
                <Form onSubmit={saveTask}>
                  <Form.Group controlId="formTask">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                      as="input"
                      rows={3}
                      placeholder="Enter task Title"
                      value={task}
                      onChange={(event) => setTask(event.target.value)}
                      isInvalid={!!errors.task}
                      className="rounded-lg"
                    />
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.task}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formDetails">
                    <Form.Label>Task Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter task details"
                      value={details}
                      onChange={(event) => setDetails(event.target.value)}
                      isInvalid={!!errors.details}
                      className="rounded-lg"
                    />
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.details}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formCompleted">
                    <Form.Check
                      type="checkbox"
                      label="Completed"
                      checked={completed}
                      onChange={(event) => setCompleted(event.target.checked)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3 w-100 rounded-pill"
                  >
                    {AddUpdateText()} Task
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddTaskComponent;
