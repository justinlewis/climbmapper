import routeType from '../../app/reducers/TypeReducer.js'

describe('the route type reducer', () => {
  it('return the state of routeType: trad when given the trad routeType', () => {
    const state = {
      routeType: 'ALL'
    }
    const action = {
      type: 'SET_FILTER',
      routeType: 'TRAD'
    }

    const expected = {
      routeType: 'TRAD'
    }
    expect(routeType(state, action)).toEqual(expected)
  })

  it('return the state of routeType: boulder when given the boulder routeType', () => {
    const state = {
      routeType: 'ALL'
    }
    const action = {
      type: 'SET_FILTER',
      routeType: 'BOULDER'
    }

    const expected = {
      routeType: 'BOULDER'
    }
    expect(routeType(state, action)).toEqual(expected)
  })
})
