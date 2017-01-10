# Unit Tests for mp_data.py
#

import unittest, json, requests, psycopg2, collections, sys, os
from mp_data import MPData_ToDo


class MPData_ToDo_Test(unittest.TestCase):

    def setUp(self):

        # We need a test account. Using Justin's for now.
        self.mpUserKey = "106251374-a0e6d43518505bec412a547956f25216"
        self.mpUserEmail = "j.mapping@gmail.com"
        self.appUserId = 1

        # Database initialization
        # mp_data.py requires write access so change dbHost accordingly
        self.dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
        self.dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
        # app_user doesn't have correct privileges, switch user with rw access
        self.dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
        self.dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
        self.dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')
        self.dbConnectParams = { 'dbHost':self.dbHost,\
                                'dbPort':self.dbPort,\
                                'dbUser':self.dbUser,\
                                'dbPass':self.dbPass,\
                                'dbName':self.dbName }

        # Initialize
        self.MPData_ToDo_Test = MPData_ToDo(self.appUserId, self.dbConnectParams)


    def tearDown(self):
        del self.MPData_ToDo_Test


    # IDK that these are useful...
    #
    #TODO create a test database instead of using prod
    # def dB_Cursor_Test(self):
    #     self.assertRaises(psycopg2.Error, self.conn.cursor(),\
    #                         msg="Could not connect DB cursor")


    def mPData_ToDo_Class_Init_Test(self):
        self.MPData_ToDo = MPData_ToDo()
        self.assertIsInstance(ovbject, MPData_ToDo,
            msg="Class could not be initialized")


    def test_GetToDos(self):
        # returns list tDoLst
        self.assertIsNot(not self.MPData_ToDo_Test.getToDos(\
                                                self.mpUserKey,\
                                                self.mpUserEmail,\
                                                self.appUserId), True,\
                                                msg="ToDo list is empty.")


    def test_GetTicks(self):
        self.assertIsNot(not self.MPData_ToDo_Test.getTicks(\
                                                self.mpUserKey,\
                                                self.mpUserEmail,\
                                                self.appUserId), True,\
                                                msg="Ticks list is empty.")


    def test_GetRoutes(self):
        self.assertIsNot(not self.MPData_ToDo_Test.getRoutes(\
                                                self.toDoIdList,\
                                                'todo',\
                                                self.mpUserKey,\
                                                []), True,\
                                                msg="Routes")


    def test_GetAreaMatchId(self):
        # Using a random array for now
        locationArr = [u'International',\
                    u'North America',\
                    u'Canada',\
                    u'British Columbia',\
                    u'Squamish',\
                    u'The Chief',\
                    u'Grand Wall Boulders']
        self.assertNotEqual(self.MPData_ToDo_Test.getAreaMatchId(\
                            locationArr),\
                            -1, msg="getAreaMatchId failed")


    # def test_GetContainingGeographyForArea(self):
    #     #TODO
    #     pass


    # def test_GetCragMatchId(self):
    #     #TODO
    #     pass


    # def test_ExistingRouteLocationExists(self):
    #     #TODO
    #     pass


    # def test_RouteExists(self):
    #     #TODO
    #     pass


    # def test_TodoExists(self):
    #     #TODO
    #     pass


    # def test_TickExists(self):
    #     #TODO
    #     pass


    # def test_GetCleanRating(self):
    #     #TODO
    #     pass


    # def test_GetCleanTypeName(self):
    #     #TODO
    #     pass


    # def test_GetRouteType(self):
    #     #TODO
    #     pass


    # def test_GetYDSGrade(self):
    #     #TODO
    #     pass


    # def test_GetBoulderGrade(self):
    #     TODO
    #     pass

if __name__ == '__main__':
    unittest.main()