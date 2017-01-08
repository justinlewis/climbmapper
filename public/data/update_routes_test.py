# Unit Tests for update_routes.py
#

import unittest
from update_routes import MPData_Routes


class MPData_Routes_Test(unittest.TestCase):

    def setUp(self):

        # We need a test account. Using Justin's for now.
        self.appUserId = "106251374-a0e6d43518505bec412a547956f25216"
        self.dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
        self.dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
        self.dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
        self.dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
        self.dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')
        self.dbConnectParams = { 'dbHost':dbHost,\
                                'dbPort':dbPort,\
                                'dbUser':dbUser,\
                                'dbPass':dbPass,\
                                'dbName':dbName }
        self.MPData_ToDo_Test = MPData_ToDo(self.appUserId, self.dbConnectParams)

    def tearDown(self):

        del self.MPData_ToDo_Test

    def updateRoutes_Test(self):
        #TODO
        pass

    def getAreaMatchId_Test(self):
        #TODO
        pass

    def getContainingGeographyForArea_Test(self):
        #TODO
        pass

    def getCragMatchId_Test(self):
        #TODO
        pass

    def existingRouteLocationExists_Test(self):
        #TODO
        pass


if __name__ == '__main__':
    unittest.main()
