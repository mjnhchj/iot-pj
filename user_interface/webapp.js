angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io'
]).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'Home'
    });
}).factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('/webapp');

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
	
}).controller('Home', function($scope, mySocket) {
	//cài đặt tham số dùng để đặt các giá trị mặc định
    $scope.CamBienMua = "Cảm biến mưa chưa kết nối!";
    $scope.leds_status = [1, 1, 1]
	$scope.senso = []
	$scope.servoPosition = 0
	$scope.buttons = []
	$scope.CamBienNhiet
	$scope.dieu_kh = [0]
	
	//Cài đặt các sự kiện khi tương tác với người dùng - các sự kiện "ng-click", nhấn nút
	$scope.updateSensor  = function() {
		mySocket.emit("RAIN")
	}
	
	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
	$scope.changeLED = function() {
		console.log("LED ", $scope.leds_status)
		
		var json = {
			"led": $scope.leds_status
		}
		mySocket.emit("LED", json)
	}
	
	//cập nhập sensor
	$scope.update_sensor = function() {
		
		
		var json = {
			"sensor": $scope.senso
		}
		console.log("Gia tri sensor ", $scope.senso)
		mySocket.emit("SENSOR", json)
	}
	
	//lenh dieu khien bang tay
	$scope.dieu_khien = function() {
		
		
		var json = {
			"dieukhien": $scope.dieu_kh
		}
		console.log("Che do dieu khien ", $scope.dieu_kh)
		mySocket.emit("DKHIEN", json)
	}
	//Cách gửi tham số 2: dùng biến cục bộ: servoPosition. Biến này đươc truyền từ file home.html, dữ liệu đươc truyền vào đó chính là biến toàn cục $scope.servoPosition. Cách 2 này sẽ giúp bạn tái sử dụng hàm này vào mục đích khác, thay vì chỉ sử dụng cho việc bắt sự kiện như cách 1, xem ở Khu 4 để biết thêm ứng dụng!
	$scope.updateServo = function(servoPosition) {
		
		var json = {
			"degree": servoPosition,
			"message": "Goc ne: " + servoPosition
		}
		
		console.log("SERVO", json)
		mySocket.emit("SERVO", json)
	}
	
	//các sự kiện từ Arduino gửi lên (thông qua esp8266)
	mySocket.on('RAIN', function(json) {
		$scope.CamBienMua = (json.digital == 1) ? "Không mưa" : "Có mưa"
		$scope.hinh = (json.digital == 1) ? "1.png" : "1.png"
	})
	//Nhiệt độ
	mySocket.on('NHIET_DOAM', function(json) {
		$scope.CamBienNhiet = json.nhietdo
		$scope.CamBienAm = json.doam

	})
	//Khi nhận được lệnh LED_STATUS
	mySocket.on('LED_STATUS', function(json) {
		console.log("recv LED", json)
		$scope.leds_status = json.data
	})
	//khi nhận được lệnh Button
	mySocket.on('BUTTON', function(json) {
		console.log("recv BUTTON", json)
		$scope.buttons = json.data
	})
	
	
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("RAIN") //Cập nhập trạng thái mưa
		
		$scope.updateServo(0) //Servo quay về góc 0 độ! 
	})
		
});