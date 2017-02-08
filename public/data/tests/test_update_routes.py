# Unit Tests for update_routes.py
#

import unittest, json, requests, psycopg2, collections, sys, os
from update_routes import MPData_Routes


class MPData_Routes_Test(unittest.TestCase):

    def setUp(self):

        # We need a test account. Using Justin's for now.
        self.mpUserKey = "106251374-a0e6d43518505bec412a547956f25216"
        self.mpUserEmail = "j.mapping@gmail.com"
        self.appUserId = 1

        self.dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
        self.dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
        self.dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "test")
        self.dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
        self.dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper_test')
        self.dbConnectParams = { 'dbHost':self.dbHost,\
                                'dbPort':self.dbPort,\
                                'dbUser':self.dbUser,\
                                'dbPass':self.dbPass,\
                                'dbName':self.dbName }

        # Initialize
        self.MPData_Routes_Test = MPData_Routes(self.dbConnectParams)

    def tearDown(self):

        del self.MPData_Routes_Test

    # def test_UpdateRoutes(self):
    #     # self.MPData_Routes_Test.updateRoutes(None, None)
    #     pass

    # def test_GetAreaMatchId(self):
    #     #TODO
    #     pass

    # def test_GetContainingGeographyForArea(self):
    #     #TODO
    #     pass

    # def test_GetCragMatchId(self):
    #     #TODO
    #     pass

    # def test_ExistingRouteLocationExists(self):
    #     #TODO
    #     pass


if __name__ == '__main__':
    unittest.main()