export class MainController {

    constructor() {
        $('#dash').on('click', () => {
            this.handleShowContainer('.dashMane', 'dash');
        });
        $('#cus').on('click', () => {
            this.handleShowContainer('.cusMane', 'cus');
        });
        $('#itm').on('click', () => {
            this.handleShowContainer('.itemMane', 'itm');
        });
        $('#or').on('click', () => {
            this.handleShowContainer('.orderMane', 'or');
        });
        $('#ord').on('click', () => {
            this.handleShowContainer('.orderDetailMane', 'ord');
        });
        $('#r-dash').on('click', () => {
            this.handleShowContainer('.dashMane', 'dash');
        });
        $('#r-cus').on('click', () => {
            this.handleShowContainer('.cusMane', 'cus');
        });
        $('#r-itm').on('click', () => {
            this.handleShowContainer('.itemMane', 'itm');
        });
        $('#r-or').on('click', () => {
            this.handleShowContainer('.orderMane', 'or');
        });
        $('#r-ord').on('click', () => {
            this.handleShowContainer('.orderDetailMane', 'ord');
        });
        $('#nav-button').on('click', (event) => {
            this.handleNavigationClassAddOrRemove(event);
        });
        this.handleAllHide();
        this.handleShowContainer('.dashMane', 'dash');
    }

    handleAllHide() {

        $('.dashMane').css({display: 'none'});
        $('.cusMane').css({display: 'none'});
        $('.itemMane').css({display: 'none'});
        $('.orderMane').css({display: 'none'});
        $('.orderDetailMane').css({display: 'none'});
    }

    handleShowContainer(container, btn) {

        $('.click').removeClass('click');
        this.handleAllHide();
        $(container).css({display: 'block'});
        $('#' + btn).addClass('click');
        $('#r-' + btn).addClass('click');
        this.handlePageCaption(btn);
    }

    handlePageCaption(btn){

        btn === 'dash' ? $('#page-header').text("Dash board") :
            btn === 'cus' ? $('#page-header').text("Customer Manage"):
                btn === 'itm' ? $('#page-header').text("Item Manage"):
                    btn === 'or' ? $('#page-header').text("Order Manage"):
                         $('#page-header').text("Recent Orders Details");
    }

    handleNavigationClassAddOrRemove(event) {

        if (!event.target.className) {
            $('.responsive-nav').addClass('click');
            $('#nav-button').addClass('click');
            return;
        }
        $('.responsive-nav').removeClass('click');
        $('#nav-button').removeClass('click');

    }
}

new MainController();