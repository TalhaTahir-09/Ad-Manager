import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar.jsx";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDeleteUser, useUsers } from "../hooks/auth";
import { useListReports } from "../hooks/data.js";
import { useCreateUser } from "../hooks/auth.js";

export default function UserList() {
  const [showModal, setShowModal] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);

  const [reportData, setReportData] = useState({
    username: "",
    password: "",
    selectedReport: null as number,
  });

  const { reports } = useListReports();
  const navigate = useNavigate();

  //   Date Format
  const formatDate = (dateStr: string) => {
    const options = {
      year: "numeric" as const,
      month: "short" as const,
      day: "numeric" as const,
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };
  //   Modal functions
  const handleOpenModalReport = () => setShowModalReport(true);
  const handleCloseModalReport = () => setShowModalReport(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const { createUser: assignReport } = useCreateUser();
  const { users } = useUsers();
  console.log("FAFA", users);
  async function handleReportAssign() {
    const reportName = reportData.selectedReport;
    await assignReport({
      username: reportData.username,
      password: reportData.password,
      report_id: reportName,
    });

    handleCloseModal();
    setReportData({
      username: "",
      password: "",
      selectedReport: null as number,
    });
  }
  function handleCreateReport() {
    navigate("/create-report-admin");
  }
  const mappedUsers = useMemo(() => {
    return users.map((user) => {
      const userData = {
        ...user,
        report_name:
          reports.find((report) => report.id === user.report_id)?.name || "",
      };
      return userData;
    });
  }, [users, reports]);
  const { deleteUser } = useDeleteUser();
  async function removeUser(user_id: number) {
    await deleteUser(user_id);
  }
  return (
    <>
      <Navbar />
      {/* [Leads] start */}
      <div
        className="col-xxl-8 d-flex flex-column justify-content-center align-items-center mt-5"
        style={{ margin: "auto" }}
      >
        <h1
          className="card-title mb-5 text-center"
          style={{ fontSize: "52px", color: "#283c50", fontWeight: "700" }}
        >
          Admin User Panel{" "}
        </h1>
        <div className="card stretch stretch-full" style={{ width: "80vw" }}>
          <div className="card-header">
            <h1
              className="card-title mb-5 text-center"
              style={{ fontSize: "32px" }}
            >
              Users{" "}
            </h1>
          </div>
          <div className="card-body custom-card-action p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr className="border-b">
                    <th scope="row" style={{ fontSize: "14px" }}>
                      Username
                    </th>
                    <th style={{ fontSize: "14px" }}>Report</th>
                    <th style={{ fontSize: "14px" }}></th>
                    {/* <th style={{ fontSize: "14px" }}>Edit</th> */}
                  </tr>
                </thead>
                {mappedUsers.length !== 0 ? (
                  mappedUsers.map((user, index) => (
                    <tbody>
                      <tr key={index}>
                        <td className="text-primary" style={{minWidth: "150px"}}>{user.username}</td>
                        <td className="text-success" style={{minWidth: "300px"}}>{user.report_name}</td>

                        <td
                          className="text-end d-flex align-items-center justify-content-center"
                        >
                          <button
                            className="mx-2 btn btn-light  ml-auto"
                            onClick={() => handleOpenModalReport()}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            className="btn btn-light"
                            style={{ marginRight: "2rem" }}
                            onClick={() => removeUser(user.id)}
                          >
                            <i className="fa-solid fa-trash mr-6"></i>
                          </button>
                          <Modal
                            show={showModalReport}
                            onHide={handleCloseModalReport}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Create User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form>
                                <Form.Group controlId="formUsername">
                                  <Form.Label>Username:</Form.Label>
                                  <Form.Control
                                    type="username"
                                    placeholder="Update username.."
                                    value={reportData.username}
                                    onChange={(e) =>
                                      setReportData({
                                        ...reportData,
                                        username: e.target.value,
                                      })
                                    }
                                  />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                  <Form.Label>Password:</Form.Label>
                                  <Form.Control
                                    type="password"
                                    placeholder="Update password.."
                                    value={reportData.password}
                                    onChange={(e) =>
                                      setReportData({
                                        ...reportData,
                                        password: e.target.value,
                                      })
                                    }
                                  />
                                </Form.Group>
                                <Form.Group controlId="formReports">
                                  <Form.Label>Reports:</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="selectedReport"
                                    value={reportData.selectedReport}
                                    onChange={(e) =>
                                      setReportData({
                                        ...reportData,
                                        selectedReport: Number(e.target.value),
                                      })
                                    }
                                  >
                                    <option value="">Select a report</option>
                                    {reports.map((report, index) => (
                                      <option key={index} value={report.id}>
                                        {report.name}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Form.Group>
                                <Button
                                  variant="primary"
                                  type="button"
                                  style={{ marginTop: "2rem" }}
                                  onClick={handleReportAssign}
                                >
                                  Create{" "}
                                </Button>
                              </Form>
                            </Modal.Body>
                          </Modal>
                        </td>
                      </tr>
                    </tbody>
                  ))
                ) : (
                  <span
                    className="d-flex justify-content-center position-absolute mt-3 align-items-center w-full"
                    style={{ width: "90%" }}
                  >
                    <span className="text-secondary fst-italic">
                      No Reports Yet...
                    </span>
                  </span>
                )}
              </table>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
            <Button
              className="btn btn-primary mt-5 "
              style={{ width: "300px", aspectRatio: "3/0.5" }}
              onClick={handleShowModal}
            >
              Create User
            </Button>
            <button
              className=" btn btn-primary mt-5"
              style={{ width: "300px", aspectRatio: "3/0.5" }}
              onClick={handleCreateReport}
            >
              Create Report
            </button>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter a username.."
                value={reportData.username}
                onChange={(e) =>
                  setReportData({ ...reportData, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter a password.."
                value={reportData.password}
                onChange={(e) =>
                  setReportData({ ...reportData, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formReports">
              <Form.Label>Reports:</Form.Label>
              <Form.Control
                as="select"
                name="selectedReport"
                value={reportData.selectedReport}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    selectedReport: Number(e.target.value),
                  })
                }
              >
                <option value="">Select a report</option>
                {reports.map((report, index) => (
                  <option key={index} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              type="button"
              style={{ marginTop: "2rem" }}
              onClick={handleReportAssign}
            >
              Create{" "}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
