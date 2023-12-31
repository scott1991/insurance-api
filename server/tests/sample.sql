INSERT INTO `Policyholders` (`code`, `name`, `registration_date`, `introducer_code`, `depth`, `parent_id`, `lchild_id`, `rchild_id`, `createdAt`, `updatedAt`) VALUES
('000001', 'AAAAAA', '2023-12-11 00:00:00', NULL, 1, NULL, NULL, NULL, NOW(), NOW()),
('000002', 'BBBBBB', '2023-12-11 00:00:00', '000001', 2, NULL, NULL, NULL, NOW(), NOW()),
('000003', 'CCCCCC', '2023-12-11 00:00:00', '000001', 2, NULL, NULL, NULL, NOW(), NOW()),
('000004', 'DDDDDD', '2023-12-11 00:00:00', '000001', 3, NULL, NULL, NULL, NOW(), NOW()),
('000005', 'EEEEEE', '2023-12-11 00:00:00', '000003', 3, NULL, NULL, NULL, NOW(), NOW()),
('000006', 'FFFFFF', '2023-12-11 00:00:00', '000001', 3, NULL, NULL, NULL, NOW(), NOW()),
('000007', 'GGGGGG', '2023-12-11 00:00:00', '000001', 3, NULL, NULL, NULL, NOW(), NOW()),
('000008', 'HHHHHH', '2023-12-11 00:00:00', '000004', 4, NULL, NULL, NULL, NOW(), NOW()),
('000009', 'IIIIII', '2023-12-11 00:00:00', '000001', 4, NULL, NULL, NULL, NOW(), NOW()),
('000010', 'JJJJJJ', '2023-12-11 00:00:00', '000002', 4, NULL, NULL, NULL, NOW(), NOW()),
('000011', 'KKKKKK', '2023-12-12 00:00:00', NULL, 1, NULL, NULL, NULL, NOW(), NOW()),
('000012', 'LLLLLL', '2023-12-12 00:00:00', '000011', 2, NULL, NULL, NULL, NOW(), NOW()),
('000013', 'L22222', '2023-12-12 00:00:00', '000010', 5, NULL, NULL, NULL, NOW(), NOW()),
('000014', 'L33333', '2023-12-12 00:00:00', '000011', 2, NULL, NULL, NULL, NOW(), NOW()),
('000015', 'L44444', '2023-12-12 00:00:00', '000011', 3, NULL, NULL, NULL, NOW(), NOW()),
('000016', 'MMMMMM', '2023-12-12 00:00:00', '000015', 4, NULL, NULL, NULL, NOW(), NOW()),
('000017', 'NNNNNN', '2023-12-12 00:00:00', '000015', 4, NULL, NULL, NULL, NOW(), NOW()),
('000018', 'OOOOOO', '2023-12-12 00:00:00', '000015', 5, NULL, NULL, NULL, NOW(), NOW()),
('000019', 'PPPPPP', '2023-12-12 00:00:00', '000016', 5, NULL, NULL, NULL, NOW(), NOW()),
('000020', 'QQQQQQ', '2023-12-12 00:00:00', '000015', 5, NULL, NULL, NULL, NOW(), NOW());

UPDATE `Policyholders`
SET `parent_id` = CASE `code`
    WHEN '000002' THEN 1
    WHEN '000003' THEN 1
    WHEN '000004' THEN 2
    WHEN '000005' THEN 3
    WHEN '000006' THEN 2
    WHEN '000007' THEN 3
    WHEN '000008' THEN 4
    WHEN '000009' THEN 4
    WHEN '000010' THEN 6
    WHEN '000012' THEN 11
    WHEN '000013' THEN 10
    WHEN '000014' THEN 11
    WHEN '000015' THEN 12
    WHEN '000016' THEN 15
    WHEN '000017' THEN 15
    WHEN '000018' THEN 16
    WHEN '000019' THEN 16
    WHEN '000020' THEN 17
    END,
`lchild_id` = CASE `code`
    WHEN '000001' THEN 2
    WHEN '000002' THEN 4
    WHEN '000003' THEN 5
    WHEN '000004' THEN 8
    WHEN '000006' THEN 10
    WHEN '000010' THEN 13
    WHEN '000011' THEN 12
    WHEN '000012' THEN 15
    WHEN '000015' THEN 16
    WHEN '000016' THEN 18
    WHEN '000017' THEN 20
    END,
`rchild_id` = CASE `code`
    WHEN '000001' THEN 3
    WHEN '000002' THEN 6
    WHEN '000003' THEN 7
    WHEN '000004' THEN 9
    WHEN '000011' THEN 14
    WHEN '000015' THEN 17
    WHEN '000016' THEN 19
    END
WHERE `code` IN ('000001', '000002', '000003', '000004', '000005', '000006', '000007', '000008', '000009', '000010', 
                 '000011', '000012', '000013', '000014', '000015', '000016', '000017', '000018', '000019', '000020');
