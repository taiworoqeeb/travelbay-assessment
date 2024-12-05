const { Package } = require("../../models/packageModel");
const { responseHandler } = require("../../utils");
const dayjs = require("dayjs");

class PackageResolver {
  constructor() {
    this.packageModel = Package;
  }

  /**
   * Creates a new package for the user
   * @param {Object} data - package data
   * @param {String} data.name - Full name of the package
   * @param {String} data.description - Description of the package
   * @param {Number} data.price - Price of the package
   * @param {String} data.expiresAt - Expiration date of the package
   * @param {String} data.userId - User id of the user creating the package
   * @returns {Object} - API response object
   */
  async createAPackageResolver(data) {
    const { name, description, price, expiresAt, userId } = data;

    if(!dayjs(expiresAt, "YYYY-MM-DD", true).isValid()) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "Please enter a valid date",
        data: {},
      });
    }

    if(dayjs(expiresAt).isBefore(dayjs())) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "Please enter a valid date",
        data: {},
      });
    }

    const newPackage = await this.packageModel.create({
      name,
      userId,
      description,
      price,
      expiresAt,
    })

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Package created successfully",
      data: {package: newPackage},
    });
  }

  /**
   * Fetches all the packages for a given user
   *
   * @param {Object} data - Data object containing the user ID
   * @param {String} data.userId - User id of the user
   * @returns {Object} - API response object containing the packages data
   */
  async getAllUserPackagesResolver(data) {
    const packages = await this.packageModel.find({userId: data.userId});

    if(packages.length === 0) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "No packages found",
        data: [],
      });
    }

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Packages fetched successfully",
      data: {packages: packages},
    });
  }

  /**
   * Fetches a single package by ID
   *
   * @param {Object} data - Data object containing the package ID
   * @param {String} data.packageId - Package ID of the package to be fetched
   * @returns {Object} - API response object containing the package data
   */
  async getPackageResolver(data) {
    const fetchPackage = await this.packageModel.findById(data.packageId);

    if(!fetchPackage) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "Package not found",
        data: {},
      });
    }

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Package fetched successfully",
      data: {package: fetchPackage},
    });
  }

  /**
   * Fetches all the packages for an admin user
   *
   * This query fetches data for all packages, regardless of user ID.
   *
   * @returns {Object} - The response object containing the packages data or an error message
   */
  async getAdminAllPackagesResolver() {
    const packages = await this.packageModel.find();

    if(packages.length === 0) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "No packages found",
        data: [],
      });
    }

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Packages fetched successfully",
      data: {packages: packages},
    });
  }

  /**
   * Retrieves all packages filtered by start and end dates for admin users
   *
   * This query fetches data for packages filtered by a specified date range.
   * Only authenticated admin users are allowed to access this data.
   *
   * @param {Object} data - An object containing the query arguments
   * @param {string} data.startDate - The start date for filtering packages, cannot be empty
   * @param {string} data.endDate - The end date for filtering packages, cannot be empty
   *
   * @return {Promise<Object>} - The response object containing the filtered packages data or an error message
   */
  async adminFilterPackagesResolver(data) {

    if(!data.hasOwnProperty("startDate") || data.startDate.trim() == "" || !data.hasOwnProperty("endDate") || data.endDate.trim() == "") {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "startDate && endDate is required as query params for expiration date filter",
        data: {},
      });
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const startDateFormat = startDate.toISOString().split("T")[0];
    const endDateFormat = endDate.toISOString().split("T")[0];

    const packages = await this.packageModel.aggregate([
        {
          $addFields: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $toDate: "$expiresAt",
                },
              },
            },
          },
        },
      {
        $match: {
          date: {
            $gte: startDateFormat,
            $lte: endDateFormat,
          },
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          expiresAt: 1,
          userId: 1,
          user: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
          }
    ])

    if(packages.length === 0) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "No packages found",
        data: [],
      });
    }

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Packages fetched successfully",
      data: {packages: packages},
    });
  }

/**
 * Retrieves all packages for a specific user filtered by expiration date.
 *
 * This function fetches data for packages that belong to the specified user
 * and fall within the given date range. The user ID, start date, and end date
 * must be provided as query parameters.
 *
 * @param {Object} data - An object containing the query arguments.
 * @param {string} data.startDate - The start date for filtering packages, cannot be empty.
 * @param {string} data.endDate - The end date for filtering packages, cannot be empty.
 * @param {string} data.userId - The ID of the user to filter packages for, cannot be empty.
 *
 * @return {Promise<Object>} - The response object containing the filtered packages data or an error message.
 */
  async userFilterPackagesResolver(data) {

    if(!data.hasOwnProperty("startDate") || data.startDate.trim() == "" || !data.hasOwnProperty("endDate") || data.endDate.trim() == "") {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "startDate && endDate is required as query params for expiration date filter",
        data: {},
      });
    }

    if(!data.hasOwnProperty("userId") || data.userId.trim() == "") {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "userId is required as query params for user filter",
        data: {},
      });
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const startDateFormat = startDate.toISOString().split("T")[0];
    const endDateFormat = endDate.toISOString().split("T")[0];

    const packages = await this.packageModel.aggregate([
        {
          $addFields: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $toDate: "$expiresAt",
                },
              },
            },
          },
        },
      {
        $match: {
          userId: data.userId,
          date: {
            $gte: startDateFormat,
            $lte: endDateFormat,
          },
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          expiresAt: 1,
        },
          }
    ])

    if(packages.length === 0) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "No packages found",
        data: [],
      });
    }

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Packages fetched successfully",
      data: {packages: packages},
    });
  }

  /**
   * Updates a package
   *
   * This query updates an existing package by a given package ID.
   * Only authenticated admin users are allowed to access this data.
   *
   * @param {Object} data - An object containing the package data to be updated
   * @param {string} data.packageId - The ID of the package to be updated, cannot be empty
   * @param {string} data.name - The new name of the package
   * @param {string} data.description - The new description of the package
   * @param {number} data.price - The new price of the package
   * @param {string} data.expiresAt - The new expiration date of the package
   *
   * @returns {Promise<Object>} - The response object containing the updated package data or an error message
   */
  async updatePackageResolver(data) {
    const packageId = data.packageId
    const fetchPackage = await this.packageModel.findById(packageId);

    if(!fetchPackage) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "Package not found",
        data: {},
      });
    }

    delete data.packageId

   await this.packageModel.findByIdAndUpdate(packageId, {...data})

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Package updated successfully",
      data: {package: fetchPackage},
    });
  }

/**
 * Deletes a package by ID
 *
 * This function deletes a package based on the provided package ID.
 * If the package is not found, it returns an error response.
 *
 * @param {Object} data - The data object containing the package ID
 * @param {string} data.packageId - The ID of the package to be deleted
 *
 * @returns {Promise<Object>} - The response object indicating success or failure of the deletion process
 */
  async deletePackageResolver(data) {
    const fetchPackage = await this.packageModel.findById(data.packageId);

    if(!fetchPackage) {
      return responseHandler({
        status: false,
        statusCode: 400,
        message: "Package not found",
        data: {},
      });
    }

   await this.packageModel.findByIdAndDelete(data.packageId)

    return responseHandler({
      status: true,
      statusCode: 200,
      message: "Package deleted successfully",
      data: {},
   })
}

}

const packageResolver = new PackageResolver()

module.exports = packageResolver
