app.controller('MessageCtrl', [
    '$scope',

    function($scope){

        var vm = this;

        vm.messages = [
            {
                'username': 'Matt',
                'content': 'Hi!'
            },
            {
                'username': 'Elisa',
                'content': 'Whats up?'
            },
            {
                'username': 'Matt',
                'content': 'I found this nice AngularJS Directive'
            },
            {
                'username': 'Elisa',
                'content': 'Looks Great!'
            }
        ];

        vm.username = 'Matt';

        vm.sendMessage = function(message, username) {
            if(message && message !== '' && username) {
                vm.messages.push({
                    'username': username,
                    'content': message
                });
            }
        };

    }]);