var coderFriends = angular.module('coderFriends', ['ui.router']);

coderFriends.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })
  .state('friend', {
    url: '/friend/:github_username',
    templateUrl: 'templates/friend.html'
  });

  $urlRouterProvider
  .otherwise('/login');
});
