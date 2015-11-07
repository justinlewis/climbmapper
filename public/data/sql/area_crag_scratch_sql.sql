-- collection of crag points by area
--SELECT c.area, ST_Collect(c.geo_point) as geo_multipoint, ST_Centroid(ST_Collect(c.geo_point)) as geo_point from crag c INNER JOIN area a ON c.area = a.id GROUP BY c.area;

-- area polygon from crag points
--SELECT c.area, ST_Buffer(ST_MakeLine(array_agg(c.geo_point)), .002) as geo_poly from crag c INNER JOIN area a ON c.area = a.id GROUP BY c.area;

-- get all areas where there is a todo route match
-- SELECT a.id, a.name, st_y(a.geo_point) as lat, st_x(a.geo_point) as long, count(*) as count 
-- FROM area a 
-- INNER JOIN route r ON r.area = a.id  
-- INNER JOIN todo t ON r.id = t.routeid
-- INNER JOIN climber c ON t.climberid = c.id 
-- GROUP BY a.id;

-- get all areas where there is a tick route match
SELECT a.id, a.name, st_y(a.geo_point) as lat, st_x(a.geo_point) as long, count(*) as count 
FROM area a 
INNER JOIN route r ON r.area = a.id  
INNER JOIN tick t ON r.id = t.routeid
INNER JOIN climber c ON t.climberid = c.id 
GROUP BY a.id;

-- get all ticks
-- SELECT r.id as routeid, r.name, r.area, rt.type, g.usa as ropegrade, g.hueco as bouldergrade, r.mpurl, r.mpimgmedurl, r.mpimgsmallurl, r.mpstars, r.mpstarvotes, r.pitches, t.notes, t.date 
-- FROM tick t 
-- INNER JOIN climber c ON t.climberid = c.id 
-- INNER JOIN route r ON t.routeid = r.id 
-- INNER JOIN area a ON r.area = a.id 
-- LEFT JOIN grade g ON r.grade = g.id 
-- LEFT JOIN route_type rt ON r.type = rt.id 
-- ORDER BY t.date;
