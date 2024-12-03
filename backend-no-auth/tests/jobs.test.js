const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");

const jobs = [
    {
    title: "Senior React Developer2",
    type: "Full-Time",
    description: "We are seeking a talented Front-End Developer to join our team in Boston, MA. The ideal candidate will have strong skills in HTML, CSS, and JavaScript, with experience working with modern JavaScript frameworks such as React or Angular.",
    company: {
      name: "NewTek Solutions",
      contactEmail: "contact@teksolutions.com",
      contactPhone: "555-555-5555"
    }},
    {
    title: "Senior React Developer3",
    type: "Full-Time",
    description: "We are seeking a talented Front-End Developer to join our team in Boston, MA. The ideal candidate will have strong skills in HTML, CSS, and JavaScript, with experience working with modern JavaScript frameworks such as React or Angular.",
    company: {
      name: "OldTek Solutions",
      contactEmail: "contact@teksolutions.com",
      contactPhone: "555-555-5555"
    }
}]
;

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/tours
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called", async () => {
    const newJob = {
      title: "Senior Engineer",
      type: "Part-Time",
      description: "ahahhaahahha",
      company:{
        name:"Jiiihuuu",
        contactEmail:"jabbaduu@juubbadii.com",
        contactPhone: "444-444-4444"
      },
    };

    await api
      .post("/api/jobs")
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobNames = jobsAfterPost.map((job) => job.name);
    expect(jobNames).toContain(newJob.name);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing tour ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      title: "Updated title",
      type: "Part-Time",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.info).toBe(updatedJob.info);
    expect(updatedJobCheck.price).toBe(updatedJob.price);
  });

  it("should return 400 for invalid job ID when PUT /api/tours/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/tours/:id
  it("should delete one job by ID when DELETE /api/job/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});
