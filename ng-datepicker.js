(function () {
    angular
        .module('datePicker', [])
        .directive('datePicker', datePicker);

    /**
     * datePicker
     *
     * @scope ngModel {object|ngModel} object or scope
     * @scope options {object} datePicker options
     *
     */
    function datePicker($rootScope, $compile, $timeout) {
        return {
            restrict: 'A',
            scope   : {
                options: '&',
                ngModel: '='
            },
            link    : linkFunc
        };

        function linkFunc(scope, element, attrs, ctrl) {
            var $ele     = $(element)
            var defaults = angular.extend({
                timepicker: false,
                autoclose : false
            }, adapterOptions(scope.options()))

            // init
            $ele.datepicker(defaults)

            // config to view
            scope.$watch(function () {
                return scope.options()
            }, function (newVal, oldVal) {
                newVal = adapterOptions(newVal)
                oldVal = adapterOptions(oldVal)

                if (newVal.startDate != oldVal.startDate) {
                    update(newVal.startDate, 'startDate')
                }

                if (newVal.endDate != oldVal.endDate) {
                    update(newVal.endDate, 'endDate')
                }
            }, true)

            // view to model, do nothing..

            // model to view
            scope.$watch('ngModel', function (newVal) {
                if ($ele.is(':focus')) return

                if (newVal) {
                    $ele.datepicker('update', newVal)
                } else {
                    $ele.val('')
                }
            })

            function update(value, type) {
                switch (type) {
                    case 'startDate':
                        $ele.datepicker('setStartDate', new Date(value))
                        break;

                    case 'endDate':
                        $ele.datepicker('setEndDate', new Date(value))
                        break;

                    default:
                    //
                }
            }

            function adapterOptions(options) {
                var map  = {
                    timePicker: 'timepicker',
                    minDate   : 'startDate',
                    maxDate   : 'endDate'
                }
                var temp = {}

                for (var p in options) {
                    if (!options.hasOwnProperty(p)) continue;

                    if (p in map) {
                        temp[map[p]] = options[p]
                    } else {
                        temp[p] = options[p]
                    }
                }

                temp.startDate = temp.startDate && new Date(temp.startDate)
                temp.endDate   = temp.endDate && new Date(temp.endDate)

                return temp
            }
        }
    }
})();
