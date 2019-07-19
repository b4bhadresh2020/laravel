<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Users Data</h3>
            <div class="card-tools">
              <button class="btn btn-success" @click="newModel">
                New User
                <i class="fa fa-user-plus fa-fw"></i>
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Register At</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.type | camelize }}</td>
                  <td>{{ user.created_at | convertDate }}</td>
                  <td>
                    <a @click="editModel(user)">
                      <i class="fas fa-edit"></i>
                    </a>
                    <a @click="deleteUser(user.id)">
                      <i class="fas fa-trash red"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.card -->
      </div>
    </div>

    <!-- Start new user model -->
    <form @submit.prevent="editMode ? updateUser() : createUser()">
      <div class="modal fade" id="addUser" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 v-show="!editMode" class="modal-title">Add New User</h4>
              <h4 v-show="editMode" class="modal-title">Update User Information</h4>
              <button type="button" class="close red" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  placeholder="Enter Email"
                  type="email"
                  name="email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.bio"
                  placeholder="Enter Bio"
                  type="text"
                  name="bio"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                />
                <has-error :form="form" field="bio"></has-error>
              </div>
              <div class="form-group">
                <select
                  v-model="form.type"
                  placeholder="Enter Type"
                  type="text"
                  name="type"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('type') }"
                >
                  <option value>Select User Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.password"
                  placeholder="Enter Password"
                  type="password"
                  name="password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
              <button v-show="editMode" type="submit" class="btn btn-primary">Update</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
    </form>
    <!-- End new user model -->
  </div>
</template>

<script>
import { setInterval } from "timers";
export default {
  data() {
    return {
      editMode: false,
      users: [],
      // create a new form instance
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        photo: ""
      })
    };
  },
  methods: {
    newModel() {
      this.editMode = false;
      this.form.reset();
      $("#addUser").modal("show");
    },
    editModel(user) {
      this.editMode = true;
      this.form.fill(user);
      $("#addUser").modal("show");
    },
    loadUser() {
      this.$Progress.start();
      axios.get("api/user").then(({ data }) => (this.users = data.data));
      this.$Progress.finish();
    },
    createUser() {
      this.form
        .post("api/user")
        .then(() => {
          $("#addUser").modal("hide");
          Fire.$emit("ReloadUser");
          Toast.fire({
            type: "success",
            title: "Create user successfully"
          });
        })
        .catch(() => {});
    },
    updateUser() {
      this.form
        .put("api/user/" + this.form.id)
        .then(() => {
          $("#addUser").modal("hide");
          Fire.$emit("ReloadUser");
          Toast.fire({
            type: "success",
            title: "Update user successfully"
          });
        })
        .catch(() => {});
    },
    deleteUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          this.form
            .delete("api/user/" + id)
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              Fire.$emit("ReloadUser");
            })
            .catch(() => {
              Swal.fire("Failed!", "Something want to wrong.", "warning");
            });
        }
      });
    }
  },
  created() {
    this.loadUser();
    Fire.$on("ReloadUser", () => {
      this.loadUser();
    });
  }
};
</script>
