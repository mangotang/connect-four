
(function(angular) {
    'user strict';
    var module = angular.module('con4', [])
        .controller('con4-ctrlr', ['$scope', '$interval', '$timeout', '$compile', function ($scope, $interval, $timeout, $compile) {

            $scope.numColms = 7;
            $scope.numRows = 6;
            $scope.colmWidth = 25;
            $scope.rowHeight = 25;
            $scope.currentColor = 'red';
            $scope.humanColor = 'red';
            $scope.BLANK = 'blank';
            $scope.NO_WINNER = "no winner yet...";
            $scope.winner = $scope.NO_WINNER;
            $scope.disableClick = false;
            $scope.gameStarted = false;

            $scope.board = [];
            for (var col=0; col<$scope.numColms; ++col) {
                $scope.board.push([]);
                for (var row = 0; row < $scope.numRows; ++row) {
                    $scope.board[col].push({
                        color: $scope.BLANK
                    });
                }
            }

            $scope.nextColor = function() {
                $scope.currentColor = ('red' == $scope.currentColor) ? 'yellow' : 'red';
            }

            $scope.colmClickHandler = function(idx, $event) {
                try {
                    if ($scope.NO_WINNER != $scope.winner || $scope.disableClick) {
                        return;
                    }
                    var colm = $scope.findColm(angular.element($event.target));
                    if ($scope.addChip(colm, idx)) {
                        $scope.nextColor();

                        $scope.winner = $scope.findWinner($scope.board);

                        if ($scope.NO_WINNER == $scope.winner) {
                            $scope.disableClick = true;
                            var promise = $timeout(function () {
                                $scope.aiTurn();
                                $scope.disableClick = false;
                            }, 600);
                        }
                    }
                } catch (ex) {
                    console.error("Failure in colmClickHandler. " + ex);
                }
            }

            $scope.playAiTurn = function() {
                $scope.aiTurn();
            }

            $scope.addChip = function(colm, idx) {
                $scope.gameStarted = true;
                var numChild = colm.find("*").length;
                if (numChild < $scope.numRows) {

                    var colmHeight = $scope.rowHeight * $scope.numRows;
                    var existingChildHeight = $scope.rowHeight * numChild;
                    var top = colmHeight - existingChildHeight - $scope.rowHeight;

                    $scope.board[idx][numChild].color = $scope.currentColor;

                    var div = angular.element('<div class="noselect" style="cursor: default; position:absolute;top:'
                        + 0 + 'px;left:0px; width:22px; height: 22px; border-radius: 11px; background-color:'
                        + $scope.currentColor + '"></div>');

                    colm.append(div);

                    // animate the drop
                    var promise = $interval(function() {
                        var nextTop = parseInt(div[0].style.top.replace("px", "")) + 1;
                        if (nextTop >= top) {
                            $interval.cancel(promise);
                        } else {
                            div[0].style.top = nextTop + "px";
                        }
                    }, 5);

                    return true;
                } else {
                    // skipping, column full
                    return false;
                }
            }

            $scope.aiTurn = function() {
                // ai must keep trying until it finds a non-full column
                do {
                    var idx = Math.floor(Math.random() * $scope.numColms);
                    var colmContainer  = angular.element(document).find("colm")[idx];
                    var colm = angular.element(colmContainer.children[0]);
                } while(!$scope.addChip(colm, idx));

                $scope.nextColor();
                $scope.winner = $scope.findWinner($scope.board);
            }

            $scope.findWinner = function(board) {
                var winner = $scope.findOnRow(board);
                if ($scope.NO_WINNER != winner) {
                    return winner;
                }
                winner = $scope.findOnColm(board);
                if ($scope.NO_WINNER != winner) {
                    return winner;
                }
                return $scope.findOnDiag(board);
            }

            $scope.findOnRow = function(board) {
                for (var row=0; row<$scope.numRows; ++row) {
                    var startColor = board[0][row].color;
                    var count = 1;
                    for (var col=1; col<$scope.numColms; ++col) {
                        var color = board[col][row].color;
                        if (startColor == color && $scope.BLANK != color) {
                            ++count;
                        } else {
                            startColor = color;
                            count = 1;
                        }
                        if (count == 4) {
                            return color;
                        }
                    }
                }
                return $scope.NO_WINNER;
            }

            $scope.findOnColm = function(board) {
                for (var col=0; col<$scope.numColms; ++col) {
                    var startColor = board[col][0].color;
                    var count = 1;
                    for (var row=1; row<$scope.numRows; ++row) {
                        var color = board[col][row].color;
                        if (startColor == color && $scope.BLANK != color) {
                            ++count;
                        } else {
                            startColor = color;
                            count = 1;
                        }
                        if (count == 4) {
                            return color;
                        }
                    }
                }
                return $scope.NO_WINNER;
            }

            $scope.findOnDiag = function(board) {
                var winner = $scope.findOnDiagLeft(board);
                if ($scope.NO_WINNER != winner) {
                    return winner;
                }
                return $scope.findOnDiagRight(board);
            }

            $scope.findOnDiagLeft = function(board) {
                for (var row=0; row<3; ++row) {
                    for (var startCol = 0; startCol < 4; ++startCol) {
                        var startColor = board[startCol][row].color;
                        count = 1;
                        for (var diag=1; diag<4; ++diag) {
                            var diagCol = startCol + diag;
                            var diagRow = row + diag;
                            var color = board[diagCol][diagRow].color;

                            if (startColor == color && $scope.BLANK != color) {
                                ++count;
                            } else {
                                startColor = color;
                                count = 1;
                            }
                            if (count == 4) {
                                return color;
                            }
                        }
                    }
                }
                return $scope.NO_WINNER;
            }

            $scope.findOnDiagRight = function(board) {
                for (var row=0; row<3; ++row) {
                    for (var startCol = $scope.numColms-1; startCol >= 3; --startCol) {

                        var startColor = board[startCol][row].color;
                        count = 1;
                        for (var diag=1; diag<4; ++diag) {
                            var diagCol = startCol - diag;
                            var diagRow = row + diag;
                            var color = board[diagCol][diagRow].color;

                            if (startColor == color && $scope.BLANK != color) {
                                ++count;
                            } else {
                                startColor = color;
                                count = 1;
                            }
                            if (count == 4) {
                                return color;
                            }
                        }
                    }
                }
                return $scope.NO_WINNER;
            }

            $scope.findColm = function(el) {
                while (el.attr('class').toLowerCase() != "inner-colm") {
                    el = el.parent();
                }
                return el;
            }
        }])
        .directive('colm', function() {
            return {
                restrict: 'E',
                template: function(elem, attr) {
                    return "<div class='inner-colm' style='width: {{colmWidth}}px; height: {{numRows*rowHeight}}px;'></div>"
                }
            };
        });

})(window.angular);