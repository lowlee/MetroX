/*
    rates.js - pay rates, allowances, tax rates and more.
    version 1.07
*/

//enterprise agreement pay rates
//rate array indexes correlate to the date of the same index of the rateDates array.

//Driver Rates
const rateDates =                       ["2015-01-11", "2015-07-12", "2016-01-10", "2016-07-10", "2017-01-08", "2017-07-09", "2018-01-07", "2018-07-08", "2019-01-06", "2020-06-07", "2020-07-05", "2021-01-03", "2021-07-04", "2022-01-02", "2022-07-03", "2023-01-01", "2024-03-10", "2024-07-14", "2025-01-12", "2025-07-13", "2026-01-11", "2026-07-12", "2027-01-10"]; //the date which the corresponding rate begins. MUST BE IN CHRONOLOGICAL ORDER (left to right)
const OJJ = /** SPOT */                 [45.1833,      45.8611,      46.5490,      47.2472,      47.9559,      48.6752,      49.4054,      50.6405,      51.9065,      53.7362,      54.2736,      55.6304,      56.1867,      57.5914,      58.1673,      59.6215,      62.6398,	   63.8926,      65.1705,      66.3110,      67.4714,      68.6521,      69.8535];
const OJH = /** TD LVL1 */              [30.6682,      31.1282,      31.5951,      32.0691,      32.5501,      33.0383,      33.5339,      34.3723,      35.2316,      36.4735,      36.8382,      37.7592,      38.1368,      39.0902,      39.4811,      40.4681,      42.5168,      43.3671,      44.2344,      45.0085,      45.7961,      46.5975,      47.4130];
const OJG = /** TRAINEE DVR */          [26.2727,      26.6668,      27.0668,      27.4728,      27.8849,      28.3031,      28.7277,      29.4459,      30.1820,      31.2459,      31.5584,      32.3473,      32.6708,      33.4876,      33.8225,      34.6680,      36.4231,      37.1516,      37.8946,      38.5578,      39.2326,      39.9192,      40.6178];
const OJB = /** CONVERSION DVR */       [42.1618,      42.7942,      43.4362,      44.0877,      44.7490,      45.4202,      46.1015,      47.2541,      48.4354,      50.1427,      50.6442,      51.9103,      52.4294,      53.7401,      54.2775,      55.6345,      58.4510,      59.6200,      60.8124,      61.8766,      62.9594,      64.0612,      65.1823];
const OGB = /** SO2 DAO */              [46.0125,      46.7027,      47.4033,      48.1143,      48.8360,      49.5686,      50.3121,      51.5699,      52.8591,      54.7224,      55.2696,      56.6513,      57.2179,      58.6483,      59.2384,      60.7157,      63.7894,      65.0652,      66.3665,      67.5279,      68.7096,      69.9120,      71.1355];
const OGD = /** SO4 ROSTERS */          [0,            0,            0,            0,            0,            0,            0,            56.1014,      56.6624,      58.0790,      58.6598,      60.1263,      60.7275,      62.2457,      62.8682,      64.4399,      67.7022,      69.0562,      70.4373,      71.6700,      72.9242,      74.2004,      75.4989];
const OGG = /** S07 */                  [53.0766,      53.8727,      54.6808,      55.5010,      56.3335,      57.1785,      58.0362,      59.4871,      60.9743,      63.1236,      63.7549,      65.3488,      66.0022,      67.6523,      68.3288,      70.0370,      73.5826,      75.0543,      76.5554,      77.8951,      79.2583,      80.6453,      82.0566];
const OGH = /** SO8 */                  [54.4860,      55.3033,      56.1328,      56.9748,      57.8295,      58.6969,      59.5774,      61.0668,      62.5935,      64.7999,      65.4479,      67.0841,      67.7550,      69.4488,      70.1433,      71.8969,      75.5367,      77.0474,      78.5883,      79.9636,      81.3630,      82.7869,      84.2357];
const OGI = /** SO9 DAOTL */            [55.8979,      56.7364,      57.5875,      58.4513,      59.3280,      60.2180,      61.1212,      62.6493,      64.2155,      66.4791,      67.1439,      68.8225,      69.5107,      71.2485,      71.9610,      73.7600,      77.4941,      79.0440,      80.6249,      82.0358,      83.4714,      84.9321,      86.4184];
const OGJ = /** SO10 */                 [57.3130,      58.1727,      59.0453,      59.9310,      60.8300,      61.7424,      62.6686,      64.2353,      65.8412,      68.1621,      68.8437,      70.5648,      71.2705,      73.0522,      73.7827,      75.6273,      79.4560,      81.0451,      82.6660,      84.1127,      85.5847,      87.0824,      88.6063];
const OGK = /** SO11 */                 [58.7235,      59.6044,      60.4984,      61.4059,      62.3270,      63.2619,      64.2108,      65.8161,      67.4615,      69.8395,      70.5379,      72.3014,      73.0244,      74.8500,      75.5985,      77.4884,      81.4112,      83.0394,      84.7002,      86.1825,      87.6907,      89.2253,      90.7867];
const OGL = /** SO12 */                 [60.1328,      61.0348,      61.9503,      62.8796,      63.8228,      64.7801,      65.7518,      67.3956,      69.0805,      71.5156,      72.2307,      74.0365,      74.7769,      76.6463,      77.4128,      79.3481,      83.3651,      85.0324,      86.7330,      88.2508,      89.7952,      91.3666,      92.9655];
const OGM = /** S013 */                 [0,            0,            0,            0,            0,            0,            0,            70.7132,      71.4203,      73.2058,      73.9379,      75.7863,      76.5442,      78.4578,      79.2424,      81.2235,      85.3355,      87.0422,      88.7830,      90.3367,      91.9176,      93.5262,      95.1629];

//Station Officer Rates 
const soC1D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            34.5576,      34.9032,      35.7757,      36.1335,      37.0368,      37.4072,      38.3424,      38.7258,      39.6940,      0,            0,            0,            0,            0,            0,            0];
const soC1D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            35.2409,      35.5933,      36.4831,      36.8480,      37.7692,      38.1469,      39.1005,      39.4915,      40.4788,      0,            0,            0,            0,            0,            0,            0];
const soC2D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            35.9206,      36.2798,      37.1868,      37.5587,      38.4977,      38.8827,      39.8547,      40.2533,      41.2596,      0,            0,            0,            0,            0,            0,            0];
const soC2D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            36.5944,      36.9604,      37.8844,      38.2632,      39.2198,      39.6120,      40.6023,      41.0083,      42.0335,      0,            0,            0,            0,            0,            0,            0];
const soC3D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            37.6637,      38.0404,      38.9914,      39.3813,      40.3658,      40.7695,      41.7887,      42.2066,      43.2618,      0,            0,            0,            0,            0,            0,            0];
const soC3D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            38.4953,      38.8803,      39.8523,      40.2508,      41.2571,      41.6697,      42.7114,      43.1385,      44.2170,      0,            0,            0,            0,            0,            0,            0];
const OBU = /** SO */                   [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            44.1614,      45.0446,      45.9455,      46.7495,      47.5676,      48.4000,      49.2470];
const OBW = /** SENIOR SO */            [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            46.4555,      47.3846,      48.3323,      49.1781,      50.0387,      50.9144,      51.8054]; 

//Stationmaster Rates       
const smC4D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            39.9302,      40.3295,      41.3377,      41.7511,      42.7949,      43.2228,      44.3034,      44.7464,      45.8651,      0,            0,            0,            0,            0,            0,            0];
const smC4D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            41.0118,      41.4219,      42.4574,      42.8820,      43.9541,      44.3936,      45.5034,      45.9585,      47.1074,      0,            0,            0,            0,            0,            0,            0];
const smC5D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            41.7971,      42.2151,      43.2704,      43.7031,      44.7957,      45.2437,      46.3748,      46.8385,      48.0095,      0,            0,            0,            0,            0,            0,            0];
const smC5D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            42.4313,      42.8557,      43.9270,      44.3663,      45.4755,      45.9302,      47.0785,      47.5493,      48.7380,      0,            0,            0,            0,            0,            0,            0];
const smC6D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            43.4759,      43.9107,      45.0085,      45.4586,      46.5950,      47.0610,      48.2375,      48.7199,      49.9379,      0,            0,            0,            0,            0,            0,            0];
const smC6D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            44.2649,      44.7076,      45.8253,      46.2835,      47.4406,      47.9150,      49.1129,      49.6040,      50.8441,      0,            0,            0,            0,            0,            0,            0];
const smC7D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            45.4446,      45.8991,      47.0466,      47.5170,      48.7050,      49.1920,      50.4218,      50.9260,      52.1992,      0,            0,            0,            0,            0,            0,            0];
const smC7D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            46.7432,      47.2107,      48.3909,      48.8749,      50.0967,      50.5977,      51.8626,      52.3813,      53.6908,      0,            0,            0,            0,            0,            0,            0];
const smC8D1Rates =                     [0,            0,            0,            0,            0,            0,            0,            48.1837,      48.6656,      49.8822,      50.3810,      51.6405,      52.1570,      53.4609,      53.9955,      55.3454,      0,            0,            0,            0,            0,            0,            0];
const smC8D2Rates =                     [0,            0,            0,            0,            0,            0,            0,            49.6039,      50.0999,      51.3524,      51.8659,      53.1626,      53.6942,      55.0366,      55.5869,      56.9766,      0,            0,            0,            0,            0,            0,            0];
const OCB = /** TRAINEE SM */           [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            49.4922,      50.4820,      51.4916,      52.3927,      53.3096,      54.2425,      55.1917];
const OCF = /** SM */                   [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            53.4181,      54.4865,      55.5762,      56.5488,      57.5384,      58.5453,      59.5698];
const OCJ = /** SENIOR SM */            [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            59.8610,      61.0582,      62.2794,      63.3693,      64.4783,      65.6067,      66.7548];

//Station Assistant Rates       
const saC3Y1Rates =                     [0,            0,            0,            0,            0,            0,            0,            28.6495,      28.9360,      29.6594,      29.9560,      30.7049,      31.0120,      31.7873,      32.1052,      32.9078,      0,            0,            0,            0,            0,            0,            0];
const saC3Y2Rates =                     [0,            0,            0,            0,            0,            0,            0,            28.9409,      29.2303,      29.9611,      30.2607,      31.0172,      31.3273,      32.1105,      32.4316,      33.2424,      0,            0,            0,            0,            0,            0,            0];
const saC3Y3Rates =                     [0,            0,            0,            0,            0,            0,            0,            29.2438,      29.5363,      30.2747,      30.5774,      31.3418,      31.6553,      32.4466,      32.7711,      33.5904,      0,            0,            0,            0,            0,            0,            0];
const saC3Y1_12THSRates =               [0,            0,            0,            0,            0,            0,            0,            28.9218,      29.2110,      29.9413,      30.2407,      30.9967,      31.3067,      32.0894,      32.4103,      33.2205,      0,            0,            0,            0,            0,            0,            0];
const saC3Y2_12THSRates =               [0,            0,            0,            0,            0,            0,            0,            29.2133,      29.5054,      30.2430,      30.5455,      31.3091,      31.6222,      32.4127,      32.7369,      33.5553,      0,            0,            0,            0,            0,            0,            0];
const saC3Y3_12THSRates =               [0,            0,            0,            0,            0,            0,            0,            29.5161,      29.8112,      30.5565,      30.8621,      31.6336,      31.9500,      32.7487,      33.0762,      33.9031,      0,            0,            0,            0,            0,            0,            0];
const saC2Y1Rates =                     [0,            0,            0,            0,            0,            0,            0,            29.3612,      29.6548,      30.3962,      30.7002,      31.4677,      31.7824,      32.5769,      32.9027,      33.7253,      0,            0,            0,            0,            0,            0,            0];
const saC2Y2Rates =                     [0,            0,            0,            0,            0,            0,            0,            29.6526,      29.9491,      30.6978,      31.0048,      31.7799,      32.0977,      32.9002,      33.2292,      34.0599,      0,            0,            0,            0,            0,            0,            0];
const saC2Y3Rates =                     [0,            0,            0,            0,            0,            0,            0,            29.9555,      30.2551,      31.0114,      31.3215,      32.1046,      32.4256,      33.2363,      33.5686,      34.4079,      0,            0,            0,            0,            0,            0,            0];
const saC1Y1Rates =                     [0,            0,            0,            0,            0,            0,            0,            29.8503,      30.1488,      30.9025,      31.2115,      31.9918,      32.3117,      33.1195,      33.4507,      34.2870,      0,            0,            0,            0,            0,            0,            0];
const saC1Y2Rates =                     [0,            0,            0,            0,            0,            0,            0,            30.1416,      30.4430,      31.2041,      31.5161,      32.3040,      32.6271,      33.4428,      33.7772,      34.6216,      0,            0,            0,            0,            0,            0,            0];
const saC1Y3Rates =                     [0,            0,            0,            0,            0,            0,            0,            30.4445,      30.7490,      31.5177,      31.8329,      32.6287,      32.9550,      33.7789,      34.1167,      34.9696,      0,            0,            0,            0,            0,            0,            0];
const lsaY1Rates =                      [0,            0,            0,            0,            0,            0,            0,            30.2272,      30.5295,      31.2927,      31.6056,      32.3958,      32.7197,      33.5377,      33.8731,      34.7199,      0,            0,            0,            0,            0,            0,            0];
const lsaY2Rates =                      [0,            0,            0,            0,            0,            0,            0,            30.5184,      30.8236,      31.5942,      31.9101,      32.7079,      33.0350,      33.8608,      34.1994,      35.0544,      0,            0,            0,            0,            0,            0,            0];
const lsaY3Rates =                      [0,            0,            0,            0,            0,            0,            0,            30.8215,      31.1297,      31.9079,      32.2270,      33.0327,      33.3630,      34.1971,      34.5391,      35.4025,      0,            0,            0,            0,            0,            0,            0];
const OBK = /** TRAINEE SA */           [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            36.8291,      37.5657,      38.3170,      38.9875,      39.6698,      40.3640,      41.0704];
const OBL = /** SA */                   [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            37.1948,      37.9387,      38.6975,      39.3747,      40.0638,      40.7649,      41.4783];

//Signalling rates
const OAO = /** SIG SO2 */              [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            44.1614,      45.0446,      45.9455,      46.7495,      47.5676,      48.4000,      49.2470];
const OAQ = /** SIG SO3 */              [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            46.4555,      47.3846,      48.3323,      49.1781,      50.0387,      50.9144,      51.8054];
const OAB = /** AC SM5 */               [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            51.2054,      52.2295,      53.2741,      54.2064,      55.1550,      56.1202,      57.1023];
const OAD = /** AC SM6 */               [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            53.4181,      54.4865,      55.5762,      56.5488,      57.5384,      58.5453,      59.5698];
const OAF = /** DC */                   [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            56.6654,      57.7987,      58.9547,      59.9864,      61.0362,      62.1043,      63.1911];


//Allowances        
const ojtAllowanceRates =               [8.8927,       9.0261,       9.1615,       9.2989,       9.4384,       9.5800,       9.7237,       9.9668,       10.2159,      10.5760,      10.6818,      10.9488,      11.0583,      11.3348,      11.4481,      11.7343,      12.3284,      12.5749,      12.8264,      13.0509,      13.2793,      13.5117,      13.7481];
const mealAllowanceRates =              [10.6413,      10.8010,      10.9630,      11.1274,      11.2943,      11.4637,      11.6357,      11.9266,      12.2248,      12.6557,      12.7823,      13.1018,      13.2329,      13.5637,      13.6993,      14.0418,      14.7527,      15.0477,      15.3487,      15.6173,      15.8906,      16.1687,      16.4516];
const suburbanAllowanceRates =          [7.6496,       7.7644,       7.8809,       7.9991,       8.1190,       8.2408,       8.3644,       8.5736,       8.7879,       9.0977,       9.1887,       9.4184,       9.5126,       9.7504,       9.8479,       10.0941,      10.6051,      10.8172,      11.0335,      11.2266,      11.4231,      11.6230,      11.8264];
const suburbanAllowanceSupp  =          [0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            0,            2.3600,       2.3600,       7.4100,       7.4100,       12.7800,      12.7800];            
const relievingExpensesRates =          [0,            0,            0,            0,            0,            0,            0,            24.4495,      24.6940,      25.3113,      25.5645,      26.2036,      26.4656,      27.1272,      27.3985,      28.0835,      29.5052,      30.0953,      30.6972,      31.2344,      31.7810,      32.3372,      32.9031];
const suburbanGroupWorkingRates=        [0,            0,            0,            0,            0,            0,            0,            7.4036,       7.4776,       7.6646,       7.7412,       7.9348,       8.0141,       8.2145,       8.2966,       8.5040,       8.9345,       9.1132,       9.2955,       9.4582,       9.6237,       9.7921,       9.9634];

const earlyShiftRatesLoco =             [2.9730,       3.0176,       3.0628,       3.1088,       3.1554,       3.2027,       3.2508,       3.3321,       3.4154,       3.5358,       3.5712,       3.6604,       3.6970,       3.7895,       3.8274,       3.9230,       4.1216,       4.2041,       4.2882,       4.3632,       4.4396,       4.5172,       4.5963]; //a shift which is rostered to commence at or between 0400 and 0530
const afternoonShiftRatesLoco =         [2.9730,       3.0176,       3.0628,       3.1088,       3.1554,       3.2027,       3.2508,       3.3321,       3.4154,       3.5358,       3.5712,       3.6604,       3.6970,       3.7895,       3.8274,       3.9230,       4.1216,       4.2041,       4.2882,       4.3632,       4.4396,       4.5172,       4.5963]; //a shift which is rostered to commence before 1800 and conclude at or after 1830.
const nightShiftRatesLoco =             [3.4944,       3.5468,       3.6000,       3.6540,       3.7088,       3.7644,       3.8209,       3.9164,       4.0143,       4.1558,       4.1974,       4.3023,       4.3453,       4.4540,       4.4985,       4.6110,       4.8444,       4.9413,       5.0401,       5.1283,       5.2180,       5.3094,       5.4023]; //a shift which is rostered to commence at or between 1800 and 0359 hours.

const earlyShiftRatesTPW =              [3.0595,       3.1054,       3.1519,       3.1992,       3.2472,       3.2959,       3.3453,       3.4290,       3.5147,       3.6386,       3.6750,       3.7669,       3.8045,       3.8996,       3.9386,       4.0371,       4.2662,       4.3515,       4.4386,       4.5162,       4.5953,       4.6757,       4.7575];
const afternoonShiftRatesTPW =          [3.0595,       3.1054,       3.1519,       3.1992,       3.2472,       3.2959,       3.3453,       3.4290,       3.5147,       3.6386,       3.6750,       3.7669,       3.8045,       3.8996,       3.9386,       4.0371,       4.2662,       4.3515,       4.4386,       4.5162,       4.5953,       4.6757,       4.7575];
const nightShiftRatesTPW =              [3.5639,       3.6173,       3.6716,       3.7266,       3.7825,       3.8393,       3.8969,       3.9943,       4.0942,       4.2385,       4.2809,       4.3879,       4.4318,       4.5426,       4.5880,       4.7027,       4.9892,       5.0890,       5.1908,       5.2816,       5.3740,       5.4681,       5.5638];

const earlyShiftRatesSal =              [3.0773,       3.1234,       3.1703,       3.2178,       3.2661,       3.3151,       3.3648,       3.4489,       3.5352,       3.6598,       3.6964,       3.7888,       3.8267,       3.9224,       3.9616,       4.0606,       4.2415,       4.3263,       4.4128,       4.4901,       4.5686,       4.6486,       4.7299];
const afternoonShiftRatesSal =          [3.0773,       3.1234,       3.1703,       3.2178,       3.2661,       3.3151,       3.3648,       3.4489,       3.5352,       3.6598,       3.6964,       3.7888,       3.8267,       3.9224,       3.9616,       4.0606,       4.2415,       4.3263,       4.4128,       4.4901,       4.5686,       4.6486,       4.7299];
const nightShiftRatesSal =              [3.5988,       3.6528,       3.7076,       3.7632,       3.8196,       3.8769,       3.9351,       4.0335,       4.1343,       4.2800,       4.3228,       4.4309,       4.4752,       4.5871,       4.6330,       4.7488,       4.9408,       5.0396,       5.1404,       5.2304,       5.3219,       5.4150,       5.5098];

const disruptionAllowanceRates=         [0,            0,            0,            0,            0,            0,            0,            0.8610,       0.8696,       0.8914,       0.9003,       0.9228,       0.9320,       0.9553,       0.9649,       0.9890,       1.0390,       1.0598,       1.0810,       1.0999,       1.1192,       1.1388,       1.1587];

//ETDSC fortnightly membership rates
const etdscFullMemberRate = 6;
const etdscHalfMemberRate = 3;
const etdscJobshareMemberRate = 12;

//compulsary super contribution rates
const superRatesDate =  ["2014-07-01",  "2021-07-01",   "2022-07-01",   "2023-07-01",   "2024-07-01",   "2025-07-01"];
const superRates =      [0.095,         0.1,            0.105,          0.11,           0.115,          0.12];

//tax scales
//the dates of each set of scales must be in chronological order (earliest date first/top)
//data from Australian Tax Office - Statement of formulas for calculating amounts to be withheld
const taxScales = [
    {
        startDate: "2018-07-01",
        // [weekly earning less than, 'a' coefficient, 'b' coefficient]
        scale1: [ //Where the tax-free threshold is not claimed
            [72, 0.1900, 0.1900],
            [361, 0.2342, 3.2130],
            [932, 0.3477, 44.2476],
            [1380, 0.3450, 41.7311],
            [3111, 0.3900, 103.8657],
            [Infinity, 0.4700, 352.7888]
        ],
        scale2: [ //Where the employee claimed the tax‑free threshold
            [355, 0, 0],
            [422, 0.1900, 67.4635],
            [528, 0.2900, 109.7327],
            [711, 0.2100, 67.4635],
            [1282, 0.3477, 165.4423],
            [1730, 0.3450, 161.9808],
            [3461, 0.3900, 239.8654],
            [Infinity,  0.4700, 516.7885]
        ]
    },
    {
        startDate: "2020-10-13",
        // [weekly earning less than, 'a' coefficient, 'b' coefficient]
        scale1: [ //Where the tax-free threshold is not claimed
            [88, 0.1900, 0.1900],
            [371, 0.2348, 3.9639],
            [515, 0.2190, -1.9003],
            [932, 0.3477, 64.4297],
            [1957, 0.3450, 61.9132],
            [3111, 0.3900, 150.0093],
            [Infinity, 0.4700, 398.9324]
        ],
        scale2: [ //Where the employee claimed the tax‑free threshold
            [359, 0, 0],
            [438, 0.1900, 68.3462],
            [548, 0.2900, 112.1942],
            [721, 0.2100, 68.3465],
            [865, 0.2190, 74.8369],
            [1282, 0.3477, 186.2119],
            [2307, 0.3450, 182.7504],
            [3461, 0.3900, 286.5965],
            [Infinity,  0.4700, 563.5196]
        ]
    }
];

//study and training support loans (STSL)/HECS
//the dates of each set of rates must be in chronological order (earliest date first/top).
const stslScales = [
    {
        startDate: "2018-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [649, 0],
                [760, 0.02],
                [886, 0.04],
                [1013, 0.045],
                [1084, 0.05],
                [1192, 0.055],
                [1320, 0.06],
                [1408, 0.065],
                [1584, 0.07],
                [1711, 0.075],
                [Infinity, 0.08]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [999, 0],
                [1110, 0.02],
                [1236, 0.04],
                [1363, 0.045],
                [1434, 0.05],
                [1542, 0.055],
                [1670, 0.06],
                [1758, 0.065],
                [1934, 0.07],
                [2061, 0.075],
                [Infinity, 0.08]
            ]
    },
    {
        startDate: "2019-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [532, 0],
                [668, 0.01],
                [729, 0.02],
                [794, 0.025],
                [863, 0.03],
                [936, 0.035],
                [1013, 0.04],
                [1095, 0.045],
                [1181, 0.05],
                [1273, 0.055],
                [1371, 0.06],
                [1474, 0.065],
                [1583, 0.07],
                [1699, 0.075],
                [1822, 0.08],
                [1953, 0.085],
                [2091, 0.09],
                [2237, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [882, 0],
                [1018, 0.01],
                [1079, 0.02],
                [1144, 0.025],
                [1213, 0.03],
                [1286, 0.035],
                [1363, 0.04],
                [1445, 0.045],
                [1531, 0.05],
                [1623, 0.055],
                [1721, 0.06],
                [1824, 0.065],
                [1933, 0.07],
                [2049, 0.075],
                [2172, 0.08],
                [2303, 0.085],
                [2441, 0.09],
                [2587, 0.095],
                [Infinity, 0.1]
            ]
    },
    {
        startDate: "2020-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [546, 0],
                [685, 0.01],
                [747, 0.02],
                [813, 0.025],
                [882, 0.03],
                [956, 0.035],
                [1035, 0.04],
                [1118, 0.045],
                [1206, 0.05],
                [1299, 0.055],
                [1398, 0.06],
                [1503, 0.065],
                [1615, 0.07],
                [1732, 0.075],
                [1855, 0.08],
                [1990, 0.085],
                [2130, 0.09],
                [2279, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [896, 0],
                [1035, 0.01],
                [1097, 0.02],
                [1163, 0.025],
                [1232, 0.03],
                [1306, 0.035],
                [1385, 0.04],
                [1468, 0.045],
                [1556, 0.05],
                [1649, 0.055],
                [1748, 0.06],
                [1853, 0.065],
                [1956, 0.07],
                [2082, 0.075],
                [2205, 0.08],
                [2340, 0.085],
                [2480, 0.09],
                [2629, 0.095],
                [Infinity, 0.1]
            ]
    },
    {
        startDate: "2023-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [641, 0],
                [794, 0.01],
                [863, 0.02],
                [936, 0.025],
                [1023, 0.03],
                [1095, 0.035],
                [1181, 0.04],
                [1273, 0.045],
                [1371, 0.05],
                [1474, 0.055],
                [1583, 0.06],
                [1699, 0.065],
                [1822, 0.07],
                [1953, 0.075],
                [2091, 0.08],
                [2237, 0.085],
                [2393, 0.09],
                [2557, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [991, 0],
                [1144, 0.01],
                [1213, 0.02],
                [1286, 0.025],
                [1363, 0.03],
                [1445, 0.035],
                [1531, 0.04],
                [1623, 0.045],
                [1721, 0.05],
                [1824, 0.055],
                [1933, 0.06],
                [2049, 0.065],
                [2172, 0.07],
                [2303, 0.075],
                [2441, 0.08],
                [2587, 0.085],
                [2743, 0.09],
                [2907, 0.095],
                [Infinity, 0.1]
            ]
    }
];