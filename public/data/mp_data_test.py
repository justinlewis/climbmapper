# Unit Tests for mp_data.py
#

import unittest
from mp_data import MPData_ToDo


class MPData_ToDo_Test(unittest.TestCase):

    def setUp(self):

        # We need a test account. Using Justin's for now.
        self.mpUserKey = "106251374-a0e6d43518505bec412a547956f25216"
        self.mpUserEmail = "j.mapping@gmail.com"
        self.appUserId = 1

        # Database initialization
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


    # def mPData_ToDo_Class_Init_Test(self):
    #     self.MPData_ToDo = MPData_ToDo()
    #     self.assertIsInstance(ovbject, MPData_ToDo,
    #         msg="Class could not be initialized")


    def getToDos_Test(self):
        # returns list tDoLst
        assertIsNot(not MPData_ToDo_Test.getToDos(self,\
                                                mpUserKey,\
                                                mpUserEmail,\
                                                appUserId), True,\
                                                        msg="ToDo list is empty.")


    def getTicks_Test(self):
        assertIsNot(not MPData_ToDo_Test.getTicks(self,\
                                                mpUserKey,\
                                                mpUserEmail,\
                                                appUserId), True,\
                                                        msg="Ticks list is empty.")


    def getRoutes_Test(self):
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


    def routeExists_Test(self):
        #TODO
        pass


    def todoExists_Test(self):
        #TODO
        pass


    def tickExists_Test(self):
        #TODO
        pass


    def getCleanRating_Test(self):
        #TODO
        pass


    def getCleanTypeName_Test(self):
        #TODO
        pass


    def getRouteType_Test(self):
        #TODO
        pass


    def getYDSGrade_Test(self):
        #TODO
        pass


    def getBoulderGrade_Test(self):
        #TODO
        pass

if __name__ == '__main__':
    unittest.main()