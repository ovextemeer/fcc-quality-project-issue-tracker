'use strict';
const { ObjectId } = require('mongodb');

module.exports = function (app) {
  let projects = [];

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let p = projects.find(p => p.projectName === project);
      let issues = p.issues.filter(issue => {
        let isPicked = true;
        for (let q in req.query) {
          if (issue[q].toString() != req.query[q]) {
            isPicked = false;
          }
        }
        return isPicked;
      });
      res.json(issues);
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issue = {
        _id: new ObjectId(),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to ? req.body.assigned_to : '',
        open: true,
        status_text: req.body.status_text ? req.body.status_text : ''
      };

      if (
        req.body.issue_title != undefined &&
        req.body.issue_text != undefined &&
        req.body.created_by != undefined
      ) {
        let p = projects.find(p => p.projectName === project);
        if (p != undefined) {
          p.issues.push(issue);
        } else {
          projects.push(new Project(project, [issue]));
        }
        res.json(issue);
      } else {
        res.json({ error: 'required field(s) missing' });
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
      let updateData = req.body;
      let p = projects.find(p => p.projectName === project);
      let issue;

      if (p != undefined && '_id' in updateData) {
        issue = p.issues.find(issue => issue._id.toString() === updateData._id.toString());
      }

      if (!('_id' in updateData)) {
        res.json({ error: 'missing _id' });
      } else if (Object.keys(updateData).length < 2) {
        res.json({ error: 'no update field(s) sent', '_id': updateData._id });
      } else if (issue != undefined) {
        for (let k in updateData) {
          if (issue[k] != updateData[k]) {
            issue[k] = updateData[k];
          }
        }
        issue.updated_on = new Date();
        res.json({ result: 'successfully updated', '_id': issue._id });
      } else {
        res.json({ error: 'could not update', '_id': updateData._id });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let deleteInfo = req.body;
      let p = projects.find(p => p.projectName === project);
      let index;

      if (p != undefined && '_id' in deleteInfo) {
        for (let i = 0; i < p.issues.length; ++i) {
          if (p.issues[i]._id.toString() === deleteInfo._id.toString()) {
            index = i;
            break;
          }
        }
      }

      if (!('_id' in deleteInfo)) {
        res.json({ error: 'missing _id' });
      } else if (index != undefined) {
        p.issues.splice(index, 1);
        res.json({ result: 'successfully deleted', '_id': deleteInfo._id });
      } else {
        res.json({ error: 'could not delete', '_id': deleteInfo._id });
      }
    });

};

function Project(projectName, issues) {
  this.projectName = projectName;
  this.issues = issues
}