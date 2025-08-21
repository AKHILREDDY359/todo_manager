import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FileText } from 'lucide-react';
import TaskCard from './TaskCard.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import './TaskList.css';

/**
 * TaskList Component
 * Features:
 * - Displays list of tasks
 * - Drag and drop reordering
 * - Loading states
 * - Empty state handling
 * - Responsive grid layout
 * - Animation support
 */
const TaskList = ({
  tasks = [],
  onToggleComplete,
  onEdit,
  onDelete,
  onReorder,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  loading = false,
  viewMode = 'list' // 'list' or 'grid'
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [optimisticTasks, setOptimisticTasks] = useState(tasks);

  // Update optimistic tasks when props change
  useEffect(() => {
    setOptimisticTasks(tasks);
  }, [tasks]);

  // Handle drag start
  const handleDragStart = (result) => {
    const draggedTask = optimisticTasks.find(task => task.id === result.draggableId);
    setDraggedTask(draggedTask);
    
    // Add dragging class to body for global styling
    document.body.classList.add('is-dragging');
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    setDraggedTask(null);
    document.body.classList.remove('is-dragging');

    // If dropped outside a droppable area
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // If position hasn't changed
    if (source.index === destination.index) {
      return;
    }

    // Create new array with reordered items
    const newTasks = Array.from(optimisticTasks);
    const [reorderedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, reorderedTask);

    // Update optimistic state immediately
    setOptimisticTasks(newTasks);

    // Call parent handler for persistence
    if (onReorder) {
      onReorder(newTasks);
    }
  };

  // Handle task actions with optimistic updates
  const handleToggleComplete = async (taskId) => {
    if (onToggleComplete) {
      // Optimistic update
      setOptimisticTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed }
            : task
        )
      );

      try {
        await onToggleComplete(taskId);
      } catch (error) {
        // Revert on error
        setOptimisticTasks(tasks);
      }
    }
  };

  const handleEdit = (task) => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = async (taskId) => {
    if (onDelete) {
      // Optimistic update
      setOptimisticTasks(prev => prev.filter(task => task.id !== taskId));

      try {
        await onDelete(taskId);
      } catch (error) {
        // Revert on error
        setOptimisticTasks(tasks);
      }
    }
  };

  // Loading state
  if (loading && optimisticTasks.length === 0) {
    return (
      <div className="task-list-loading">
        <LoadingSpinner size="large" message="Loading your tasks..." />
      </div>
    );
  }

  // Empty state
  if (optimisticTasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-illustration">
          <div className="empty-icon">
            <FileText size={64} />
          </div>
          <h3>No tasks found</h3>
          <p>Your task list is empty. Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-list-container ${viewMode}`}>
      <DragDropContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Droppable droppableId="task-list" direction="vertical">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            >
              {optimisticTasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                  isDragDisabled={loading}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging
                          ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                          : provided.draggableProps.style?.transform
                      }}
                    >
                      <TaskCard
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddSubtask={onAddSubtask}
                        onUpdateSubtask={onUpdateSubtask}
                        onDeleteSubtask={onDeleteSubtask}
                        isDragging={snapshot.isDragging}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {/* Drop indicator */}
              {snapshot.isDraggingOver && (
                <div className="drop-indicator">
                  <div className="drop-line"></div>
                  <span className="drop-text">Drop here to reorder</span>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Loading overlay for updates */}
      {loading && optimisticTasks.length > 0 && (
        <div className="task-list-overlay">
          <div className="overlay-content">
            <LoadingSpinner size="small" />
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
