<template>
  <div class="list">
    <div v-for="(task, index) in tasks" :key="task._id" class="task center">
      <div class="center">
        <input
          type="checkbox"
          :checked="task.completed"
          class="checkbox"
          @click="
            $emit('putTask', {
              ...task,
              index: index,
              completed: !task.completed,
            })
          "
        />
        <h1 class="description">{{ task.description }}</h1>
      </div>
      <h1
        class="delete"
        @click="$emit('deleteTask', { ...task, index: index })"
      >
        ✖
      </h1>
    </div>
  </div>
</template>

<script>
  export default {
    name: "taskList",
    props: ["tasks"],
  };
</script>

<style>
  .list {
    margin: 1rem 0;
  }
  .task {
    border: 1px solid #000;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 1rem;
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .checkbox {
    transform: scale(1.5);
  }
  .description {
    margin-left: 1rem;
  }
  .delete {
    cursor: pointer;
  }
</style>
