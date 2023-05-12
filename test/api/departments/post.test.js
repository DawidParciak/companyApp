const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Department = require('../../../models/department.model.js');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/departments', () => {

  const departmentName = 'Department #1';

  after(async () => {
    await Department.deleteMany();
  });

  it('/ should insert new document to db and return success', async () => {
    const res = await request(server).post('/api/departments').send({ name: departmentName });
    const newDepartment = await Department.findOne({ name: departmentName });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newDepartment).to.not.be.null;
  });
});
