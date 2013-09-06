;(function(g) {
    if(g.command) {
        return;
    }
    var command = g.command = {
        version: '0.0.1',
        /* 发送请求码和数据 */
        post_to_multiwii: function(code, data) {
            data = data === undefined ? '' : data.toString();
            var _len = data.length,
                /* 发送字节串的串 */
                _message = '$M<' + _len + code + data + get_crc(_len, code, data);
            return _message;
        },
        /* 接收来自multiwii的信息 */
        get_from_multiwii: function(code, message) {
            /* multiwii返回不认识的信息 */
            var _unknown_type = /^\$M!\d+/;
            if(message.match(_unknown_type)) {
                return false;
            }
            var _reg = '^\\$M>(\\d{1,3})code(\\d+)',
                _len = 0,
                _pattern =  new RegExp(_reg.replace('code', code)),
                _match = message.match(_pattern);
            if(!_match) {
                return false;
            }
            _len = _match[1];
            _mix_data = _match[2];
            _data =  _mix_data.slice(0, _len);
            _crc = _mix_data.slice(_len, _mix_data.length);
            if(_crc != get_crc(_len, code, _data)) {
                return false;
            }
            //回调以后每个code做自己的数据解码
            return _data;
        }
    }
    function get_crc(_len, _code, _data) {
        return _len ^ _code ^ _data;
    }
})(this);
