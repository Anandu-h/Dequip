// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ToolChain is ReentrancyGuard, Ownable {
    struct Tool {
        uint256 id;
        string name;
        string description;
        string category;
        uint256 pricePerDay;
        address owner;
        bool isAvailable;
        string imageHash; // BNB Greenfield hash
        string location;
        uint256 createdAt;
        uint256 totalRentals;
        uint256 totalEarnings;
    }

    struct Rental {
        uint256 id;
        uint256 toolId;
        address renter;
        uint256 startTime;
        uint256 endTime;
        uint256 totalCost;
        bool isActive;
        bool isCompleted;
        uint256 deposit;
    }

    struct User {
        address userAddress;
        uint256 reputation;
        uint256 totalRentals;
        uint256 totalEarnings;
        bool isVerified;
        string profileHash; // BNB Greenfield hash
    }

    mapping(uint256 => Tool) public tools;
    mapping(uint256 => Rental) public rentals;
    mapping(address => User) public users;
    mapping(address => uint256[]) public userTools;
    mapping(address => uint256[]) public userRentals;

    uint256 public nextToolId = 1;
    uint256 public nextRentalId = 1;
    uint256 public platformFee = 250; // 2.5%
    uint256 public constant REPUTATION_MULTIPLIER = 10;

    IERC20 public toolToken;

    event ToolListed(uint256 indexed toolId, address indexed owner, string name, uint256 pricePerDay);
    event ToolRented(uint256 indexed rentalId, uint256 indexed toolId, address indexed renter, uint256 duration);
    event ToolReturned(uint256 indexed rentalId, uint256 indexed toolId, address indexed renter);
    event ReputationUpdated(address indexed user, uint256 newReputation);

    constructor(address _toolToken) {
        toolToken = IERC20(_toolToken);
    }

    function listTool(
        string memory _name,
        string memory _description,
        string memory _category,
        uint256 _pricePerDay,
        string memory _imageHash,
        string memory _location
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_pricePerDay > 0, "Price must be greater than 0");

        tools[nextToolId] = Tool({
            id: nextToolId,
            name: _name,
            description: _description,
            category: _category,
            pricePerDay: _pricePerDay,
            owner: msg.sender,
            isAvailable: true,
            imageHash: _imageHash,
            location: _location,
            createdAt: block.timestamp,
            totalRentals: 0,
            totalEarnings: 0
        });

        userTools[msg.sender].push(nextToolId);

        // Initialize user if not exists
        if (users[msg.sender].userAddress == address(0)) {
            users[msg.sender] = User({
                userAddress: msg.sender,
                reputation: 100,
                totalRentals: 0,
                totalEarnings: 0,
                isVerified: false,
                profileHash: ""
            });
        }

        emit ToolListed(nextToolId, msg.sender, _name, _pricePerDay);
        nextToolId++;
    }

    function rentTool(uint256 _toolId, uint256 _duration) external payable nonReentrant {
        require(tools[_toolId].id != 0, "Tool does not exist");
        require(tools[_toolId].isAvailable, "Tool is not available");
        require(tools[_toolId].owner != msg.sender, "Cannot rent your own tool");
        require(_duration > 0, "Duration must be greater than 0");

        uint256 totalCost = tools[_toolId].pricePerDay * _duration;
        uint256 deposit = totalCost / 2; // 50% deposit
        require(msg.value >= totalCost + deposit, "Insufficient payment");

        tools[_toolId].isAvailable = false;

        rentals[nextRentalId] = Rental({
            id: nextRentalId,
            toolId: _toolId,
            renter: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + (_duration * 1 days),
            totalCost: totalCost,
            isActive: true,
            isCompleted: false,
            deposit: deposit
        });

        userRentals[msg.sender].push(nextRentalId);

        // Initialize renter if not exists
        if (users[msg.sender].userAddress == address(0)) {
            users[msg.sender] = User({
                userAddress: msg.sender,
                reputation: 100,
                totalRentals: 0,
                totalEarnings: 0,
                isVerified: false,
                profileHash: ""
            });
        }

        emit ToolRented(nextRentalId, _toolId, msg.sender, _duration);
        nextRentalId++;
    }

    function returnTool(uint256 _rentalId) external nonReentrant {
        require(rentals[_rentalId].id != 0, "Rental does not exist");
        require(rentals[_rentalId].renter == msg.sender, "Not the renter");
        require(rentals[_rentalId].isActive, "Rental is not active");

        Rental storage rental = rentals[_rentalId];
        Tool storage tool = tools[rental.toolId];

        rental.isActive = false;
        rental.isCompleted = true;
        tool.isAvailable = true;

        // Calculate platform fee
        uint256 fee = (rental.totalCost * platformFee) / 10000;
        uint256 ownerPayment = rental.totalCost - fee;

        // Pay tool owner
        payable(tool.owner).transfer(ownerPayment);
        
        // Return deposit to renter
        payable(msg.sender).transfer(rental.deposit);

        // Update statistics
        tool.totalRentals++;
        tool.totalEarnings += ownerPayment;
        users[tool.owner].totalEarnings += ownerPayment;
        users[msg.sender].totalRentals++;

        // Update reputation
        _updateReputation(tool.owner, 5);
        _updateReputation(msg.sender, 3);

        emit ToolReturned(_rentalId, rental.toolId, msg.sender);
    }

    function _updateReputation(address _user, uint256 _points) internal {
        users[_user].reputation += _points;
        emit ReputationUpdated(_user, users[_user].reputation);
    }

    function updateProfileHash(string memory _profileHash) external {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        users[msg.sender].profileHash = _profileHash;
    }

    function getToolsByOwner(address _owner) external view returns (uint256[] memory) {
        return userTools[_owner];
    }

    function getRentalsByUser(address _user) external view returns (uint256[] memory) {
        return userRentals[_user];
    }

    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        platformFee = _fee;
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
