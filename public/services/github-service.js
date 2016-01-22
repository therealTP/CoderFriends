coderFriends.service('ghSvc', function($http) {
  this.getFollowing = function() {
    return $http({
      method: 'GET',
      url: '/github/following'
    })
    .then(
      function(response) {
        return response;
      }
    );
  };
});
