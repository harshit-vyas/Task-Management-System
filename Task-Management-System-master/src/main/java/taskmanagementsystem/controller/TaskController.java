package taskmanagementsystem.controller;



import jakarta.validation.Valid;
import taskmanagementsystem.dto.ApiResponse;
import taskmanagementsystem.model.Task;
import taskmanagementsystem.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping("/user/{id}")
    public ResponseEntity<ApiResponse> createTask(@Valid @RequestBody Task task, @PathVariable("id") Long userId) {
        System.out.println("TaskController: createTask() userId: "+userId);
        return new ResponseEntity<>(service.createTask(task, userId), HttpStatus.CREATED);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse> getTaskById(@PathVariable Integer taskId) {
        System.out.println("TaskController getTaskById taskID:"+taskId);
        return new ResponseEntity<>(service.getTaskById(taskId), HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable("id") Long userId) {
        System.out.println("TaskController getTasks userID:"+userId);
        return new ResponseEntity<>(service.getAllTasks(userId), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateTask(@PathVariable Integer id, @Valid @RequestBody Task task) {
        return new ResponseEntity<>(service.updateTask(task, id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTaskById(@PathVariable Integer id) {
        service.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @PostMapping("/{id}/task-done")
    public ResponseEntity<ApiResponse> completedTodo(@PathVariable Integer id) {
        System.out.println("task done");
        return  ResponseEntity.ok(service.doneTask(id));
    }

    @PostMapping("/{id}/task-pending")
    public ResponseEntity<ApiResponse> inCompletedTodo(@PathVariable Integer id){
        System.out.println("task pending");
        return ResponseEntity.ok(service.pendingTask(id));
    }
}