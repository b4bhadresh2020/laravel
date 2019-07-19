/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");
import moment from "moment";
import { Form, HasError, AlertError } from "vform";

window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

import VueRouter from "vue-router";
Vue.use(VueRouter);

import VueProgressBar from "vue-progressbar";
Vue.use(VueProgressBar, {
    color: "rgb(143, 255, 199)",
    failedColor: "red",
    height: "2px"
});

import Swal from "sweetalert2";
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000
});
window.Toast = Toast;

window.Fire = new Vue();

const routes = [
    {
        path: "/dashboard",
        component: require("./components/Dashboard.vue").default
    },
    { path: "/users", component: require("./components/Users.vue").default },
    { path: "/profile", component: require("./components/Profile.vue").default }
];

const router = new VueRouter({
    mode: "history",
    routes // short for `routes: routes`
});

Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);

// Create a custom filter

Vue.filter("camelize", function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter("convertDate", function(mydate) {
    return moment(mydate).format("MMMM Do YYYY");
});

const app = new Vue({
    el: "#app",
    router
});
