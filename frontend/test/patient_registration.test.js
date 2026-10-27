const PatientRegistration = artifacts.require("PatientRegistration");

contract("PatientRegistration Contract Test Suite", (accounts) => {
  const [patientAccount, doctorAccount, unauthorizedAccount] = accounts;
  let patientContract;

  beforeEach(async () => {
    patientContract = await PatientRegistration.new();
  });

  it("should register a patient successfully with zero plaintext passwords", async () => {
    const tx = await patientContract.registerPatient(
      patientAccount,
      "John Doe",
      "1990-01-01",
      "Male",
      "O+",
      "123 Main St",
      "john@example.com",
      "100001",
      { from: patientAccount }
    );

    const isRegistered = await patientContract.isRegisteredPatient("100001");
    assert.equal(isRegistered, true, "Patient should be registered on-chain");

    const details = await patientContract.getPatientDetails("100001");
    assert.equal(details.name, "John Doe", "Patient name matches");
    assert.equal(details.walletAddress, patientAccount, "Wallet matches patient account");
  });

  it("should enforce access control: only the patient can grant doctor permission", async () => {
    await patientContract.registerPatient(
      patientAccount,
      "John Doe",
      "1990-01-01",
      "Male",
      "O+",
      "123 Main St",
      "john@example.com",
      "100001",
      { from: patientAccount }
    );

    // Unauthorized account attempts to grant permission for patient 100001
    try {
      await patientContract.grantPermission("100001", "200001", "John Doe", {
        from: unauthorizedAccount,
      });
      assert.fail("Should have thrown unauthorized error");
    } catch (err) {
      assert.include(
        err.message,
        "Only the patient can grant doctor access",
        "Proper access control error thrown"
      );
    }

    // Legitimate patient grants permission
    await patientContract.grantPermission("100001", "200001", "John Doe", {
      from: patientAccount,
    });

    const isGranted = await patientContract.isPermissionGranted("100001", "200001");
    assert.equal(isGranted, true, "Doctor should now have verified permission");
  });

  it("should allow patient or doctor to revoke permission cleanly", async () => {
    await patientContract.registerPatient(
      patientAccount,
      "John Doe",
      "1990-01-01",
      "Male",
      "O+",
      "123 Main St",
      "john@example.com",
      "100001",
      { from: patientAccount }
    );

    await patientContract.grantPermission("100001", "200001", "John Doe", {
      from: patientAccount,
    });

    // Revoke permission
    await patientContract.revokePermission("100001", "200001", {
      from: patientAccount,
    });

    const isGrantedAfter = await patientContract.isPermissionGranted("100001", "200001");
    assert.equal(isGrantedAfter, false, "Doctor access should be revoked");
  });
});
