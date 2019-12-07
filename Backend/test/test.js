
var expect = require('chai').expect;
var request = (require('request').defaults({ jar: true }));
const { spawn } = require('child_process');
const path = require('path');
const ls = spawn('node', [path.join(__dirname, '..', 'server.js')], { "env": { ...process.env, "PORT": 3005 } });

describe('GrubHub', function () {
    this.timeout(10000);

    // runs before all tests in this block
    before(function (done) {
        setTimeout(() => {
            request.post({
                url: 'http://localhost:3005/api/v1/users/login',
                form: { email: "testbuyer@abc.com", password: "admin" }
            }, function (error, response, body) {
                // console.log(body);
                expect(response.statusCode).to.equal(200);
                done();
            });
        }, 2000);
    });

    after(() => ls.kill('SIGTERM'));

    //test to view profile
    it('Test to view profile', function (done) {
        request(
            {
                url: 'http://localhost:3005/api/v1/users/profile/',
                json: true
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
    });

    //test to search
    it('Get Items with Tea', function (done) {
        // console.log('within test item search');
        request(
            {
                url: 'http://localhost:3005/api/v1/item/',
                qs: { itemName: 'Tea' }
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
    });

    //test to add order
    it('Test to add Muffins Order', function (done) {
        request(
            {
                url: 'http://localhost:3005/api/v1/order/',
                form: {
                    items: {
                        itemID: 'cdf5b752-4b43-4457-adf6-81d83835bf68',
                        quantity: '2'
                    },
                    restaurantId: '1f8e3577-3ee7-4373-b4a8-fe8534d3d317',
                    deliveryAdd: 'San Mateo'
                },
                json: true
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
    });

    //test to get upcoming orders
    it('Test to check upcoming Orders', function (done) {
        // console.log('within test item search');
        request(
            {
                url: 'http://localhost:3005/api/v1/order/',
                qs: { status: 'new' },
                json: true
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
    });
    //test to get past orders
    it('Test to get past orders', function (done) {
        // console.log('within test item search');
        request(
            {
                url: 'http://localhost:3005/api/v1/order/',
                qs: { status: 'delivered' },
                json: true
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
    });

})