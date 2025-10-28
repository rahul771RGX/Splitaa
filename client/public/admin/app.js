/* Splitaa Admin Panel (AngularJS 1.8) */
(function() {
    'use strict';

    angular.module('splitaaAdmin', [])
        .constant('DEFAULT_API_BASE', '')
        .service('AdminApi', ['$http', '$q', 'DEFAULT_API_BASE', function($http, $q, DEFAULT_API_BASE) {
            // This service supports mock mode (default) and real API mode.
            var useReal = false;
            var base = DEFAULT_API_BASE || '';

            this.setOptions = function(opts) {
                useReal = !!opts.useReal;
                base = opts.base || base;
            };

            var mock = {
                users: [
                    { name: 'Alice', email: 'alice@example.com' },
                    { name: 'Bob', email: 'bob@example.com' }
                ],
                groups: [
                    { name: 'Trip to Goa' },
                    { name: 'Roommates' }
                ],
                expenses: [
                    { desc: 'Dinner', amount: 45.5 },
                    { desc: 'Groceries', amount: 78 }
                ]
            };

            function maybeHttp(method, url, data) {
                if (!useReal) {
                    return $q.resolve({ data: null });
                }
                var cfg = { method: method, url: (base || '') + url };
                if (data) cfg.data = data;
                return $http(cfg);
            }

            this.getUsers = function() {
                if (!useReal) return $q.resolve(angular.copy(mock.users));
                return maybeHttp('GET', '/api/users').then(function(r) { return r.data; });
            };

            this.getGroups = function() {
                if (!useReal) return $q.resolve(angular.copy(mock.groups));
                return maybeHttp('GET', '/api/groups').then(function(r) { return r.data; });
            };

            this.getExpenses = function() {
                if (!useReal) return $q.resolve(angular.copy(mock.expenses));
                return maybeHttp('GET', '/api/expenses').then(function(r) { return r.data; });
            };

            // For demo: basic in-memory mutations when in mock mode.
            this.createUser = function(user) {
                if (!useReal) { mock.users.push(angular.copy(user)); return $q.resolve(user); }
                return maybeHttp('POST', '/api/users', user).then(function(r) { return r.data; });
            };
            this.deleteUser = function(id) {
                if (!useReal) { mock.users.splice(id, 1); return $q.resolve(); }
                return maybeHttp('DELETE', '/api/users/' + id);
            };

            this.createGroup = function(g) {
                if (!useReal) { mock.groups.push(angular.copy(g)); return $q.resolve(g); }
                return maybeHttp('POST', '/api/groups', g).then(function(r) { return r.data; });
            };
            this.deleteGroup = function(id) {
                if (!useReal) { mock.groups.splice(id, 1); return $q.resolve(); }
                return maybeHttp('DELETE', '/api/groups/' + id);
            };

            this.createExpense = function(e) {
                if (!useReal) { mock.expenses.push(angular.copy(e)); return $q.resolve(e); }
                return maybeHttp('POST', '/api/expenses', e).then(function(r) { return r.data; });
            };
            this.deleteExpense = function(id) {
                if (!useReal) { mock.expenses.splice(id, 1); return $q.resolve(); }
                return maybeHttp('DELETE', '/api/expenses/' + id);
            };

        }])
        .controller('AdminCtrl', ['AdminApi', '$timeout', function(AdminApi, $timeout) {
            var vm = this;
            vm.useRealApi = false;
            vm.apiBase = '';

            // Bindings used by index.html
            vm.useRealApi = false;
            vm.apiBase = '';
            vm.users = [];
            vm.groups = [];
            vm.expenses = [];

            vm.newUser = {};
            vm.newGroup = {};
            vm.newExpense = {};

            vm.reload = function() {
                AdminApi.setOptions({ useReal: vm.useRealApi, base: vm.apiBase });
                AdminApi.getUsers().then(function(d) { vm.users = d || []; });
                AdminApi.getGroups().then(function(d) { vm.groups = d || []; });
                AdminApi.getExpenses().then(function(d) { vm.expenses = d || []; });
            };

            vm.addUser = function() {
                if (!vm.newUser.name || !vm.newUser.email) return;
                AdminApi.createUser(vm.newUser).then(function() { vm.newUser = {};
                    vm.reload(); });
            };
            vm.deleteUser = function(idx) {
                AdminApi.deleteUser(idx).then(function() { vm.reload(); });
            };

            vm.addGroup = function() {
                if (!vm.newGroup.name) return;
                AdminApi.createGroup(vm.newGroup).then(function() { vm.newGroup = {};
                    vm.reload(); });
            };
            vm.deleteGroup = function(idx) {
                AdminApi.deleteGroup(idx).then(function() { vm.reload(); });
            };

            vm.addExpense = function() {
                if (!vm.newExpense.desc || !vm.newExpense.amount) return;
                AdminApi.createExpense(vm.newExpense).then(function() { vm.newExpense = {};
                    vm.reload(); });
            };
            vm.deleteExpense = function(idx) {
                AdminApi.deleteExpense(idx).then(function() { vm.reload(); });
            };

            // Initial load (delay to allow bindings)
            $timeout(vm.reload, 0);

        }]);

})();