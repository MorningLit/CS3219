<template>
  <h1>Add a task!</h1>
  <form @submit.prevent="createTaskClear">
    <input
      type="text"
      class="input-task"
      v-model="task.description"
      maxlength="20"
    />
    <input type="submit" value="Submit" />
  </form>
</template>

<script>
  export default {
    name: "inputTask",
    emits: ["createTask"],
    data() {
      return {
        task: {
          description: "",
        },
      };
    },
    methods: {
      createTaskClear() {
        this.$emit("createTask", this.task);
        this.task.description = "";
      },
    },
  };
</script>

<style>
  form {
    display: flex;
    justify-content: space-between;
  }
  input {
    padding: 1rem;
    font-size: 1.5rem;
  }
  .input-task {
    width: stretch;
  }
</style>
