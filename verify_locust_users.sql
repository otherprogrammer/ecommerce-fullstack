-- Verificar usuarios creados por Locust
-- Ejecutar en pgAdmin

-- Contar todos los usuarios creados por las pruebas
SELECT COUNT(*) as total_usuarios_prueba
FROM public.accounts_customuser 
WHERE username LIKE 'user_%';

-- Ver los últimos 20 usuarios creados
SELECT 
    id,
    username,
    email,
    date_joined,
    is_active
FROM public.accounts_customuser 
WHERE username LIKE 'user_%'
ORDER BY date_joined DESC
LIMIT 20;

-- Estadísticas por fecha de creación
SELECT 
    DATE(date_joined) as fecha,
    COUNT(*) as usuarios_creados
FROM public.accounts_customuser 
WHERE username LIKE 'user_%'
GROUP BY DATE(date_joined)
ORDER BY fecha DESC;
