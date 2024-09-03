const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let ids = [];
    this.timeout(5000);

    suite('POST request to /api/issues/{project}', function () {
        test('Create an issue with every field', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/test')
                .send({
                    issue_title: "Fix error in posting data",
                    issue_text: "When we post data it has an error.",
                    created_by: "Joe",
                    assigned_to: "Joe",
                    status_text: "In QA"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    ids.push(res.body._id);
                    assert.isTrue(ObjectId.isValid(res.body._id));
                    assert.strictEqual(res.body.issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body.issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body.created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body.updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body.created_by, "Joe");
                    assert.strictEqual(res.body.assigned_to, "Joe");
                    assert.isTrue(res.body.open, true);
                    assert.strictEqual(res.body.status_text, "In QA");
                    done();
                });
        });

        test('Create an issue with only required fields', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/test')
                .send({
                    issue_title: "Fix error in posting data",
                    issue_text: "When we post data it has an error.",
                    created_by: "Win"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    ids.push(res.body._id);
                    assert.isTrue(ObjectId.isValid(res.body._id));
                    assert.strictEqual(res.body.issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body.issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body.created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body.updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body.created_by, "Win");
                    assert.strictEqual(res.body.assigned_to, "");
                    assert.isTrue(res.body.open, true);
                    assert.strictEqual(res.body.status_text, "");
                    done();
                });
        });

        test('Create an issue with missing required fields', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/test')
                .send({
                    issue_title: "Fix error in posting data",
                    created_by: "Joe",
                    assigned_to: "Joe",
                    status_text: "In QA"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.error, "required field(s) missing");
                    done();
                });
        });
    });

    suite('GET request to /api/issues/{project}', function () {
        test('View issues on a project', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/test')
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.length, 2);
                    assert.isTrue(ObjectId.isValid(res.body[0]._id));
                    assert.strictEqual(res.body[0].issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body[0].issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body[0].created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body[0].updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body[0].created_by, "Joe");
                    assert.strictEqual(res.body[0].assigned_to, "Joe");
                    assert.isTrue(res.body[0].open, true);
                    assert.strictEqual(res.body[0].status_text, "In QA");
                    assert.isTrue(ObjectId.isValid(res.body[1]._id));
                    assert.strictEqual(res.body[1].issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body[1].issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body[1].created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body[1].updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body[1].created_by, "Win");
                    assert.strictEqual(res.body[1].assigned_to, "");
                    assert.isTrue(res.body[1].open, true);
                    assert.strictEqual(res.body[1].status_text, "");
                    done();
                });
        });

        test('View issues on a project with one filter', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/test?open=true')
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.length, 2);
                    assert.isTrue(ObjectId.isValid(res.body[0]._id));
                    assert.strictEqual(res.body[0].issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body[0].issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body[0].created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body[0].updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body[0].created_by, "Joe");
                    assert.strictEqual(res.body[0].assigned_to, "Joe");
                    assert.isTrue(res.body[0].open, true);
                    assert.strictEqual(res.body[0].status_text, "In QA");
                    assert.isTrue(ObjectId.isValid(res.body[1]._id));
                    assert.strictEqual(res.body[1].issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body[1].issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body[1].created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body[1].updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body[1].created_by, "Win");
                    assert.strictEqual(res.body[1].assigned_to, "");
                    assert.isTrue(res.body[1].open, true);
                    assert.strictEqual(res.body[1].status_text, "");
                    done();
                });
        });

        test('View issues on a project with multiple filter', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/test?open=true&created_by=Win')
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.length, 1);
                    assert.isTrue(ObjectId.isValid(res.body[0]._id));
                    assert.strictEqual(res.body[0].issue_title, "Fix error in posting data");
                    assert.strictEqual(res.body[0].issue_text, "When we post data it has an error.");
                    assert.approximately(
                        (new Date(res.body[0].created_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.approximately(
                        (new Date(res.body[0].updated_on)).getTime(),
                        (new Date()).getTime(),
                        5000
                    );
                    assert.strictEqual(res.body[0].created_by, "Win");
                    assert.strictEqual(res.body[0].assigned_to, "");
                    assert.isTrue(res.body[0].open, true);
                    assert.strictEqual(res.body[0].status_text, "");
                    done();
                });
        });
    });

    suite('PUT request to /api/issues/{project}', function () {
        test('Update one field on an issue', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/test')
                .send({
                    _id: ids[0],
                    issue_title: "Updated title"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body._id, ids[0]);
                    assert.strictEqual(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('Update multiple fields on an issue', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/test')
                .send({
                    _id: ids[1],
                    issue_title: "Updated title",
                    issue_text: "Updated text"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body._id, ids[1]);
                    assert.strictEqual(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('Update an issue with missing _id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/test')
                .send({
                    issue_title: "Updated title",
                    issue_text: "Updated text"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.error, 'missing _id');
                    done();
                });
        });

        test('Update an issue with no fields to update', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/test')
                .send({
                    _id: ids[0]
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body._id, ids[0]);
                    assert.strictEqual(res.body.error, 'no update field(s) sent');
                    done();
                });
        });

        test('Update an issue with an invalid _id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/test')
                .send({
                    _id: 'textabcd',
                    issue_title: "Updated title"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body._id, 'textabcd');
                    assert.strictEqual(res.body.error, 'could not update');
                    done();
                });
        });
    });

    suite('DELETE request to /api/issues/{project}', function () {

        test('Delete an issue', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/test')
                .send({
                    _id: ids[0]
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body._id, ids[0]);
                    assert.strictEqual(res.body.result, 'successfully deleted');
                    done();
                });
        });

        test('Delete an issue with an invalid _id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/test')
                .send({
                    _id: 'textabcd'
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body._id, 'textabcd');
                    assert.strictEqual(res.body.error, 'could not delete');
                    done();
                });
        });

        test('Delete an issue with missing _id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/test')
                .send({})
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.error, 'missing _id');
                    done();
                });
        });

    });

});
