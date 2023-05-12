const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Department = require('../../../models/department.model.js');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {

  const departmentId = '5d9f1140f10a81216cfd4408';
  const incorrectDepartmentId = '5d9f1140f10a81216cfd4409';
  const departmentName = 'Department #1';
  const newDepartmentName = '=#Department #1='

  before(async () => {
    const testDepOne = new Department({ _id: departmentId, name: departmentName });
    await testDepOne.save();
  });
  
  after(async () => {
    await Department.deleteMany();
  });

  it('/:id should delete chosen document and return success', async () => {
    const res = await request(server).delete(`/api/departments/${departmentId}`).send({ name: newDepartmentName });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
  });

  it('/:id should return error if id is incorrect', async () => {
    const res = await request(server).delete(`/api/departments/${incorrectDepartmentId}`).send({ name: newDepartmentName });
    expect(res.status).to.be.equal(404);
  })
});
