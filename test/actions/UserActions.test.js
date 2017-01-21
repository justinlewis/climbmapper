import { clickFeature, filterByRouteType } from '../../app/actions/UserActions'
import * as types from '../../app/constants/ActionTypes';


describe('User Actions', () => {
  it('the clickFeature action should return a type and a feature ', () => {
    const feature = {
      properties: {
        area: "Lumpy Ridge",
        pitches: 20,
        difficulty: 5.10
      },
    }
    const action = {
      type: types.CLICK_FEATURE,
      feature: {
        properties: {
          area: "Lumpy Ridge",
          pitches: 20,
          difficulty: 5.10
        }
      }
    }

    expect(clickFeature(feature)).toEqual(action)
  })
  it('the filterByRouteType action should return a type and a routeType ', () => {
    const routeTypeFilterText = 'TRAD'

    const action = {
      type: types.SET_FILTER,
      routeType: 'TRAD',
  }

    expect(filterByRouteType(routeTypeFilterText)).toEqual(action)
  })

})
