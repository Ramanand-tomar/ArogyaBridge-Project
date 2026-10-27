// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DoctorRegistration
 * @dev Manages doctor profiles and verification on-chain.
 * Plaintext passwords and insecure validation removed.
 */
contract DoctorRegistration {
    struct Doctor {
        address walletAddress;
        string doctorName;
        string hospitalName;
        string dateOfBirth;
        string gender;
        string email;
        string hhNumber;
        string specialization;
        string department;
        string designation;
        string workExperience;
    }

    mapping(string => address) private doctorAddresses;
    mapping(string => Doctor) private doctors;
    mapping(address => string) public walletToDoctorHH;

    string[] public allDoctorHHNumbers;

    event DoctorRegistered(
        string indexed hhNumber,
        string doctorName,
        address indexed walletAddress
    );

    function registerDoctor(
        string memory _doctorName,
        string memory _hospitalName,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _email,
        string memory _hhNumber,
        string memory _specialization,
        string memory _department,
        string memory _designation,
        string memory _workExperience
    ) external {
        require(doctorAddresses[_hhNumber] == address(0), "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            walletAddress: msg.sender,
            doctorName: _doctorName,
            hospitalName: _hospitalName,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            email: _email,
            hhNumber: _hhNumber,
            specialization: _specialization,
            department: _department,
            designation: _designation,
            workExperience: _workExperience
        });

        doctors[_hhNumber] = newDoctor;
        doctorAddresses[_hhNumber] = msg.sender;
        walletToDoctorHH[msg.sender] = _hhNumber;
        allDoctorHHNumbers.push(_hhNumber);

        emit DoctorRegistered(_hhNumber, _doctorName, msg.sender);
    }

    function getAllDoctors()
        external
        view
        returns (
            string[] memory doctorNames,
            string[] memory hospitalNames,
            string[] memory dateOfBirths,
            string[] memory genders,
            string[] memory emails,
            string[] memory hhNumbers,
            string[] memory specializations,
            string[] memory departments,
            string[] memory designations,
            string[] memory workExperiences
        )
    {
        uint256 len = allDoctorHHNumbers.length;

        doctorNames = new string[](len);
        hospitalNames = new string[](len);
        dateOfBirths = new string[](len);
        genders = new string[](len);
        emails = new string[](len);
        hhNumbers = new string[](len);
        specializations = new string[](len);
        departments = new string[](len);
        designations = new string[](len);
        workExperiences = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            string memory hh = allDoctorHHNumbers[i];
            Doctor memory doctor = doctors[hh];

            doctorNames[i] = doctor.doctorName;
            hospitalNames[i] = doctor.hospitalName;
            dateOfBirths[i] = doctor.dateOfBirth;
            genders[i] = doctor.gender;
            emails[i] = doctor.email;
            hhNumbers[i] = doctor.hhNumber;
            specializations[i] = doctor.specialization;
            departments[i] = doctor.department;
            designations[i] = doctor.designation;
            workExperiences[i] = doctor.workExperience;
        }
        return (
            doctorNames,
            hospitalNames,
            dateOfBirths,
            genders,
            emails,
            hhNumbers,
            specializations,
            departments,
            designations,
            workExperiences
        );
    }

    function isRegisteredDoctor(string memory _hhNumber) external view returns (bool) {
        return doctorAddresses[_hhNumber] != address(0);
    }

    function getDoctorCount() external view returns (uint256) {
        return allDoctorHHNumbers.length;
    }

    function getDoctorDetails(string memory _hhNumber)
        external
        view
        returns (
            address _walletAddress,
            string memory _doctorName,
            string memory _hospitalName,
            string memory _dateOfBirth,
            string memory _gender,
            string memory _email,
            string memory _specialization,
            string memory _department,
            string memory _designation,
            string memory _workExperience
        )
    {
        require(doctorAddresses[_hhNumber] != address(0), "Doctor not registered");
        Doctor memory doctor = doctors[_hhNumber];
        return (
            doctor.walletAddress,
            doctor.doctorName,
            doctor.hospitalName,
            doctor.dateOfBirth,
            doctor.gender,
            doctor.email,
            doctor.specialization,
            doctor.department,
            doctor.designation,
            doctor.workExperience
        );
    }
}
