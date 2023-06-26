module.exports.createTableCoords = () => {
  return `
  CREATE TABLE IF NOT EXISTS redstore_coords (
	id int(11) NOT NULL AUTO_INCREMENT,
	tipo tinyint(4) NOT NULL DEFAULT 0,
	name varchar(50) DEFAULT NULL,
	x varchar(255) NOT NULL DEFAULT '0',
	y varchar(255) NOT NULL DEFAULT '0',
	z varchar(255) NOT NULL DEFAULT '0',
	icon int(11) NOT NULL DEFAULT 0,
	PRIMARY KEY (id)
  )
    `;
};

module.exports.createTableHome = () => {
	return `
	  CREATE TABLE IF NOT EXISTS redstore_homes (
		id int(11) NOT NULL AUTO_INCREMENT,
		home varchar(50) NOT NULL DEFAULT '0',
		PRIMARY KEY (id)
	  )
	  `;
  };
  

module.exports.insertHomes = () => {
  return `
  INSERT INTO redstore_homes (id, home) VALUES
	(1, 'PL06'),
	(2, 'FH60'),
	(3, 'LS09'),
	(4, 'FH22'),
	(5, 'PC21'),
	(6, 'KR30'),
	(7, 'LX31'),
	(8, 'LX22'),
	(9, 'FH55'),
	(10, 'FH38'),
	(11, 'LX21'),
	(12, 'GR10'),
	(13, 'LS50'),
	(14, 'LX19'),
	(15, 'LX37'),
	(16, 'LX05'),
	(17, 'FH19'),
	(18, 'LV29'),
	(19, 'LX45'),
	(20, 'FH89'),
	(21, 'LX66'),
	(22, 'FH58'),
	(23, 'FH66'),
	(24, 'FH31'),
	(25, 'LX48'),
	(26, 'PC33'),
	(27, 'FH67'),
	(28, 'PC32'),
	(29, 'LX60'),
	(30, 'PL18'),
	(31, 'FH27'),
	(32, 'LX09'),
	(33, 'LX67'),
	(34, 'FH09'),
	(35, 'LS24'),
	(36, 'LX27'),
	(37, 'FH99'),
	(38, 'FH97'),
	(39, 'FH98'),
	(40, 'LV18'),
	(41, 'LX43'),
	(42, 'BL05'),
	(43, 'KR04'),
	(44, 'FH44'),
	(45, 'FH45'),
	(46, 'BL29'),
	(47, 'FZ01'),
	(48, 'LX44'),
	(49, 'SS01'),
	(50, 'BL15'),
	(51, 'MS09'),
	(52, 'LV01'),
	(53, 'PB19'),
	(54, 'LX38'),
	(55, 'LX46'),
	(56, 'FH53'),
	(57, 'BL25'),
	(58, 'LS51'),
	(59, 'FH85'),
	(60, 'MS08'),
	(61, 'MS07'),
	(62, 'FH65'),
	(63, 'FH43'),
	(64, 'LX36'),
	(65, 'KR11'),
	(66, 'MS05'),
	(67, 'LX29'),
	(68, 'FH75'),
	(69, 'FH76'),
	(70, 'KR19'),
	(71, 'MS03'),
	(72, 'LX47'),
	(73, 'LV31'),
	(74, 'KR40'),
	(75, 'LS04'),
	(76, 'MS04'),
	(77, 'BL07'),
	(78, 'FH86'),
	(79, 'FH48'),
	(80, 'GR03'),
	(81, 'BL28'),
	(82, 'LX56'),
	(83, 'PB32'),
	(84, 'FH56'),
	(85, 'LS62'),
	(86, 'LV12'),
	(87, 'LX54'),
	(88, 'LS42'),
	(89, 'FH37'),
	(90, 'BL06'),
	(91, 'LV35'),
	(92, 'PB04'),
	(93, 'PC13'),
	(94, 'LX53'),
	(95, 'PB31'),
	(96, 'LX18'),
	(97, 'PL16'),
	(98, 'FH47'),
	(99, 'FH35'),
	(100, 'LX58'),
	(101, 'LS10'),
	(102, 'FH36'),
	(103, 'PB30'),
	(104, 'LS31'),
	(105, 'LX34'),
	(106, 'KR38'),
	(107, 'PB29'),
	(108, 'KR25'),
	(109, 'BL04'),
	(110, 'AS03'),
	(111, 'AS19'),
	(112, 'LX25'),
	(113, 'AS20'),
	(114, 'AS12'),
	(115, 'FH21'),
	(116, 'LS39'),
	(117, 'FH32'),
	(118, 'PB10'),
	(119, 'LX28'),
	(120, 'PC31'),
	(121, 'PC17'),
	(122, 'LV14'),
	(123, 'LX06'),
	(124, 'KR36'),
	(125, 'BL22'),
	(126, 'LS20'),
	(127, 'PL14'),
	(128, 'AS04'),
	(129, 'FH01'),
	(130, 'LX02'),
	(131, 'LX65'),
	(132, 'PB20'),
	(133, 'FH41'),
	(134, 'PB18'),
	(135, 'LV08'),
	(136, 'PB17'),
	(137, 'LX12'),
	(138, 'LS22'),
	(139, 'FH17'),
	(140, 'PC36'),
	(141, 'LX52'),
	(142, 'FH18'),
	(143, 'KR08'),
	(144, 'PC11'),
	(145, 'FH23'),
	(146, 'PB14'),
	(147, 'FH08'),
	(148, 'LV16'),
	(149, 'LX17'),
	(150, 'PL03'),
	(151, 'PB13'),
	(152, 'KR20'),
	(153, 'FH96'),
	(154, 'FH11'),
	(155, 'KR29'),
	(156, 'LS36'),
	(157, 'FH46'),
	(158, 'GR14'),
	(159, 'FH12'),
	(160, 'PB11'),
	(161, 'PB09'),
	(162, 'KR14'),
	(163, 'FH52'),
	(164, 'PB08'),
	(165, 'FH28'),
	(166, 'PB07'),
	(167, 'LX41'),
	(168, 'FH05'),
	(169, 'LS59'),
	(170, 'PC04'),
	(171, 'LX01'),
	(172, 'PB03'),
	(173, 'PB02'),
	(174, 'LS38'),
	(175, 'FH90'),
	(176, 'LV23'),
	(177, 'FH15'),
	(178, 'LV25'),
	(179, 'FH50'),
	(180, 'PL21'),
	(181, 'PL20'),
	(182, 'PL19'),
	(183, 'PL17'),
	(184, 'PL15'),
	(185, 'LS69'),
	(186, 'FH25'),
	(187, 'LX68'),
	(188, 'PB22'),
	(189, 'LV02'),
	(190, 'PL08'),
	(191, 'FH34'),
	(192, 'PL13'),
	(193, 'PL12'),
	(194, 'PL11'),
	(195, 'PL09'),
	(196, 'BL03'),
	(197, 'LS23'),
	(198, 'LX42'),
	(199, 'FH26'),
	(200, 'PL07'),
	(201, 'PL05'),
	(202, 'PL04'),
	(203, 'PL02'),
	(204, 'LX07'),
	(205, 'LX26'),
	(206, 'PL01'),
	(207, 'LS64'),
	(208, 'FH16'),
	(209, 'FH54'),
	(210, 'PC35'),
	(211, 'LS30'),
	(212, 'KR39'),
	(213, 'FH14'),
	(214, 'LX16'),
	(215, 'PC37'),
	(216, 'FH02'),
	(217, 'FH06'),
	(218, 'PC38'),
	(219, 'LV11'),
	(220, 'LS53'),
	(221, 'PC34'),
	(222, 'FH51'),
	(223, 'LS68'),
	(224, 'PC30'),
	(225, 'FH68'),
	(226, 'KR34'),
	(227, 'PC19'),
	(228, 'LX11'),
	(229, 'PC01'),
	(230, 'FH07'),
	(231, 'PC26'),
	(232, 'AS17'),
	(233, 'GR15'),
	(234, 'FH57'),
	(235, 'PC24'),
	(236, 'BL21'),
	(237, 'KR15'),
	(238, 'FH04'),
	(239, 'PC23'),
	(240, 'GR05'),
	(241, 'PC22'),
	(242, 'PC20'),
	(243, 'LS08'),
	(244, 'LX04'),
	(245, 'PC28'),
	(246, 'PC18'),
	(247, 'PB25'),
	(248, 'LS05'),
	(249, 'PC16'),
	(250, 'BL01'),
	(251, 'PC15'),
	(252, 'FH13'),
	(253, 'LV32'),
	(254, 'FH72'),
	(255, 'LS34'),
	(256, 'PB15'),
	(257, 'PC10'),
	(258, 'PC09'),
	(259, 'AS10'),
	(260, 'PC07'),
	(261, 'PC06'),
	(262, 'FH30'),
	(263, 'PC05'),
	(264, 'BL12'),
	(265, 'PB05'),
	(266, 'PC03'),
	(267, 'LV15'),
	(268, 'PC27'),
	(269, 'GR06'),
	(270, 'LS72'),
	(271, 'KR26'),
	(272, 'AS21'),
	(273, 'LX49'),
	(274, 'BL23'),
	(275, 'LX40'),
	(276, 'AS18'),
	(277, 'AS16'),
	(278, 'GR07'),
	(279, 'FH49'),
	(280, 'AS08'),
	(281, 'PB16'),
	(282, 'LX13'),
	(283, 'AS14'),
	(284, 'FH42'),
	(285, 'AS13'),
	(286, 'FH80'),
	(287, 'KR37'),
	(288, 'LX51'),
	(289, 'LX03'),
	(290, 'PB26'),
	(291, 'PC08'),
	(292, 'AS09'),
	(293, 'FH70'),
	(294, 'AS07'),
	(295, 'LX70'),
	(296, 'LS16'),
	(297, 'FH69'),
	(298, 'GR11'),
	(299, 'PC29'),
	(300, 'LX30'),
	(301, 'PB27'),
	(302, 'LS56'),
	(303, 'LS26'),
	(304, 'AS02'),
	(305, 'BL11'),
	(306, 'AS01'),
	(307, 'GR13'),
	(308, 'FH10'),
	(309, 'LS27'),
	(310, 'AS06'),
	(311, 'GR09'),
	(312, 'LS47'),
	(313, 'GR08'),
	(314, 'LX59'),
	(315, 'FH20'),
	(316, 'GR04'),
	(317, 'LV06'),
	(318, 'LX10'),
	(319, 'LX69'),
	(320, 'FH59'),
	(321, 'LV05'),
	(322, 'LX24'),
	(323, 'FH03'),
	(324, 'LS40'),
	(325, 'KR28'),
	(326, 'LS54'),
	(327, 'KR35'),
	(328, 'KR27'),
	(329, 'LX08'),
	(330, 'FH33'),
	(331, 'AS05'),
	(332, 'LX33'),
	(333, 'FH40'),
	(334, 'KR33'),
	(335, 'KR17'),
	(336, 'LS32'),
	(337, 'LS15'),
	(338, 'FH79'),
	(339, 'KR31'),
	(340, 'PB28'),
	(341, 'KR24'),
	(342, 'BL14'),
	(343, 'KR23'),
	(344, 'FH24'),
	(345, 'KR22'),
	(346, 'PC25'),
	(347, 'LX14'),
	(348, 'LX61'),
	(349, 'KR16'),
	(350, 'KR13'),
	(351, 'BL02'),
	(352, 'LS19'),
	(353, 'LS06'),
	(354, 'MS06'),
	(355, 'KR10'),
	(356, 'KR09'),
	(357, 'LX20'),
	(358, 'AS15'),
	(359, 'FH93'),
	(360, 'KR07'),
	(361, 'LS35'),
	(362, 'LS67'),
	(363, 'KR05'),
	(364, 'LX39'),
	(365, 'KR03'),
	(366, 'FH81'),
	(367, 'FH78'),
	(368, 'BL32'),
	(369, 'KR01'),
	(370, 'LV34'),
	(371, 'LV33'),
	(372, 'PC14'),
	(373, 'LX64'),
	(374, 'LV30'),
	(375, 'LS11'),
	(376, 'LS58'),
	(377, 'FH84'),
	(378, 'LV28'),
	(379, 'LX32'),
	(380, 'LV26'),
	(381, 'LV24'),
	(382, 'LS18'),
	(383, 'PL22'),
	(384, 'LV22'),
	(385, 'LV10'),
	(386, 'LV21'),
	(387, 'BL19'),
	(388, 'LV20'),
	(389, 'LV19'),
	(390, 'LV17'),
	(391, 'FH64'),
	(392, 'LS61'),
	(393, 'PC02'),
	(394, 'PB24'),
	(395, 'LS46'),
	(396, 'FH92'),
	(397, 'LV09'),
	(398, 'LV07'),
	(399, 'GR02'),
	(400, 'BL08'),
	(401, 'LS03'),
	(402, 'FH63'),
	(403, 'KR02'),
	(404, 'BL17'),
	(405, 'FH91'),
	(406, 'FH39'),
	(407, 'BL30'),
	(408, 'FH88'),
	(409, 'FH73'),
	(410, 'MS02'),
	(411, 'BL27'),
	(412, 'BL09'),
	(413, 'BL26'),
	(414, 'KR18'),
	(415, 'PB23'),
	(416, 'FH83'),
	(417, 'LS43'),
	(418, 'BL18'),
	(419, 'BL31'),
	(420, 'BL16'),
	(421, 'BL13'),
	(422, 'LS55'),
	(423, 'LV04'),
	(424, 'LS71'),
	(425, 'LS21'),
	(426, 'LS66'),
	(427, 'LS65'),
	(428, 'LS63'),
	(429, 'FH29'),
	(430, 'LS60'),
	(431, 'LX62'),
	(432, 'PB06'),
	(433, 'LS57'),
	(434, 'LS12'),
	(435, 'BL10'),
	(436, 'KR41'),
	(437, 'LS52'),
	(438, 'FH95'),
	(439, 'LS49'),
	(440, 'LS48'),
	(441, 'LV13'),
	(442, 'LS45'),
	(443, 'LS44'),
	(444, 'BL20'),
	(445, 'LS41'),
	(446, 'GR01'),
	(447, 'PB01'),
	(448, 'LS37'),
	(449, 'KR06'),
	(450, 'PC12'),
	(451, 'LS33'),
	(452, 'KR32'),
	(453, 'FH62'),
	(454, 'LS29'),
	(455, 'LS28'),
	(456, 'GR12'),
	(457, 'FH87'),
	(458, 'LS25'),
	(459, 'LS70'),
	(460, 'KR12'),
	(461, 'LS17'),
	(462, 'LS14'),
	(463, 'LS13'),
	(464, 'LS01'),
	(465, 'LS07'),
	(466, 'LV03'),
	(467, 'FH82'),
	(468, 'LS02'),
	(469, 'PB21'),
	(470, 'LX63'),
	(471, 'BL24'),
	(472, 'LX57'),
	(473, 'LX50'),
	(474, 'LX55'),
	(475, 'LX35'),
	(476, 'LV27'),
	(477, 'LX23'),
	(478, 'LX15'),
	(479, 'FH100'),
	(480, 'FH74'),
	(481, 'PB12'),
	(482, 'FH94'),
	(483, 'FH71'),
	(484, 'FH77'),
	(485, 'FH61'),
	(486, 'KR21');
    `;
};

/**
 * @param {Error} error
 */
module.exports.printError = (error) => {
  console.error(error.name);
  console.error(error.message);
  console.error(
    Array.isArray(error.stack)
      ? error.stack.map(JSON.stringify).join("\n")
      : error
  );
};
