/**
 * Created by chamod on 25-Dec-16.
 */
module.exports = function (io) {
    io.on('connection', function(socket){
        socket.on('chat message', function(message){
            socket.broadcast.emit('chat message', message);
        });

        socket.on('typing', function(data){
            socket.broadcast.emit('typing', data);
        });

        socket.on('doneTyping', function(id){
            socket.broadcast.emit('doneTyping', id);
        });
    });
}