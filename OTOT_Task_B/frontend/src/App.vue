<template>
  <div class="container">
    <InputTask @createTask="createTask" />
    <TaskList :tasks="tasks" @putTask="putTask" @deleteTask="deleteTask" />
  </div>
</template>

<script>
  import TaskList from "./components/TaskList.vue";
  import InputTask from "./components/InputTask.vue";
  import axios from "axios";

  const ROUTE = "http://localhost:3000/api/tasks/";
  export default {
    name: "App",
    components: {
      TaskList,
      InputTask,
    },
    data() {
      return {
        tasks: [],
      };
    },
    mounted() {
      axios
        .get(ROUTE)
        .then((res) => (this.tasks = res.data))
        .catch((err) => console.log(err));
    },
    methods: {
      createTask(newTask) {
        axios
          .post(ROUTE, newTask)
          .then((res) => (this.tasks = [res.data, ...this.tasks]))
          .catch((err) => console.log(err));
      },
      putTask(editedTask) {
        axios
          .put(ROUTE + editedTask._id, editedTask)
          .then((res) => (this.tasks[editedTask.index] = res.data))
          .catch((err) => console.log(err));
      },
      deleteTask(deletedTask) {
        axios
          .delete(ROUTE + deletedTask._id)
          .then(() => {
            this.tasks.splice(deletedTask.index, 1);
          })
          .catch((err) => console.log(err));
      },
    },
  };
</script>

<style>
  body {
    margin: 0;
    font-family: monospace;
  }
  #app {
    width: 100%;
  }
  .container {
    width: 80%;
    margin: auto;
  }
</style>
