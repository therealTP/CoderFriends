coderFriends.controller('homeCtrl', function($scope, ghSvc) {
  ghSvc.getFollowing()
  .then(
    function(response) {
      $scope.following = response;
    }
  );

  $scope.test = 'CONNECTED!';
});
