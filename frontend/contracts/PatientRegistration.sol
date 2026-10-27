// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PatientRegistration
 * @dev Manages patient records, registry, and doctor access permissions securely.
 * Note: Passwords and sensitive unencrypted medical credentials are removed from on-chain storage.
 */
contract PatientRegistration {
    struct Patient {
        address walletAddress;
        string name;
        string dateOfBirth;
        string gender;
        string bloodGroup;
        string homeAddress;
        string email;
        string hhNumber;
    }

    struct PatientList {
        string patient_number;
        string patient_name;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) public patients;
    mapping(address => string) public walletToPatientHH;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    string[] public allPatientHHNumbers;

    event PatientRegistered(
        string indexed hhNumber,
        string name,
        address indexed walletAddress
    );
    event PermissionGranted(
        string indexed patientNumber,
        string indexed doctorNumber
    );
    event PermissionRevoked(
        string indexed patientNumber,
        string indexed doctorNumber
    );

    modifier onlyRegisteredPatient(string memory _hhNumber) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        _;
    }

    function registerPatient(
        address _walletAddress,
        string memory _name,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _homeAddress,
        string memory _email,
        string memory _hhNumber
    ) external {
        require(!isPatientRegistered[_hhNumber], "Patient already registered");
        address targetWallet = _walletAddress != address(0) ? _walletAddress : msg.sender;

        Patient memory newPatient = Patient({
            walletAddress: targetWallet,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            homeAddress: _homeAddress,
            email: _email,
            hhNumber: _hhNumber
        });

        patients[_hhNumber] = newPatient;
        isPatientRegistered[_hhNumber] = true;
        walletToPatientHH[targetWallet] = _hhNumber;
        allPatientHHNumbers.push(_hhNumber);

        emit PatientRegistered(_hhNumber, _name, targetWallet);
    }

    function isRegisteredPatient(
        string memory _hhNumber
    ) external view returns (bool) {
        return isPatientRegistered[_hhNumber];
    }

    function getPatientCount() external view returns (uint256) {
        return allPatientHHNumbers.length;
    }

    function getAllPatients()
        external
        view
        returns (
            string[] memory names,
            string[] memory dateOfBirths,
            string[] memory genders,
            string[] memory bloodGroups,
            string[] memory homeAddresses,
            string[] memory emails,
            string[] memory hhNumbers
        )
    {
        uint256 len = allPatientHHNumbers.length;

        names = new string[](len);
        dateOfBirths = new string[](len);
        genders = new string[](len);
        bloodGroups = new string[](len);
        homeAddresses = new string[](len);
        emails = new string[](len);
        hhNumbers = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            string memory hh = allPatientHHNumbers[i];
            Patient memory patient = patients[hh];

            names[i] = patient.name;
            dateOfBirths[i] = patient.dateOfBirth;
            genders[i] = patient.gender;
            bloodGroups[i] = patient.bloodGroup;
            homeAddresses[i] = patient.homeAddress;
            emails[i] = patient.email;
            hhNumbers[i] = patient.hhNumber;
        }
        return (
            names,
            dateOfBirths,
            genders,
            bloodGroups,
            homeAddresses,
            emails,
            hhNumbers
        );
    }

    function getPatientDetails(
        string memory _hhNumber
    )
        external
        view
        onlyRegisteredPatient(_hhNumber)
        returns (
            address walletAddress,
            string memory name,
            string memory dateOfBirth,
            string memory gender,
            string memory bloodGroup,
            string memory homeAddress,
            string memory email
        )
    {
        Patient memory patient = patients[_hhNumber];
        return (
            patient.walletAddress,
            patient.name,
            patient.dateOfBirth,
            patient.gender,
            patient.bloodGroup,
            patient.homeAddress,
            patient.email
        );
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external onlyRegisteredPatient(_patientNumber) {
        // Enforce access control: only the patient can grant doctor access
        require(
            patients[_patientNumber].walletAddress == msg.sender,
            "Only the patient can grant doctor access"
        );
        require(
            !doctorPermissions[_patientNumber][_doctorNumber],
            "View Access already given to the Doctor!"
        );

        // Check if the patient number already exists in the list
        bool exists = false;
        for (uint256 i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        Dpermission[_doctorNumber][i].patient_number
                    )
                ) == keccak256(abi.encodePacked(_patientNumber))
            ) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            PatientList memory newRecord = PatientList(
                _patientNumber,
                _patientName
            );
            Dpermission[_doctorNumber].push(newRecord);
        }
        doctorPermissions[_patientNumber][_doctorNumber] = true;
        emit PermissionGranted(_patientNumber, _doctorNumber);
    }

    function revokePermission(
        string memory _patientNumber,
        string memory _doctorNumber
    ) external onlyRegisteredPatient(_patientNumber) {
        // Patient or doctor with current access can revoke permission
        require(
            patients[_patientNumber].walletAddress == msg.sender ||
            doctorPermissions[_patientNumber][_doctorNumber],
            "Unauthorized to revoke permission"
        );

        doctorPermissions[_patientNumber][_doctorNumber] = false;

        // Remove patient from doctor's list
        uint256 len = Dpermission[_doctorNumber].length;
        for (uint256 i = 0; i < len; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        Dpermission[_doctorNumber][i].patient_number
                    )
                ) == keccak256(abi.encodePacked(_patientNumber))
            ) {
                Dpermission[_doctorNumber][i] = Dpermission[_doctorNumber][len - 1];
                Dpermission[_doctorNumber].pop();
                break;
            }
        }

        emit PermissionRevoked(_patientNumber, _doctorNumber);
    }

    function isPermissionGranted(
        string memory _patientNumber,
        string memory _doctorNumber
    ) external view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function getPatientList(
        string memory _doctorNumber
    ) external view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }
}
