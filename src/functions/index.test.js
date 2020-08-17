const {
  onlyUnique,
  getGroups,
  organizeGroups,
  createBins,
  findBin,
  getBins,
  createDate,
  createJulianDay,
  createGroupType,
  dataJulianner,
  dataBinner,
  dataGroupper,
  dateCreator,
  groupFinder,
  groupGroupper,

  getMean,
  getStandardDeviation,
  getStandardError,
  variableGroupper,
  variableFinder,
  getEffortIds,
  groupByEffortId,
  joinNetHours,
  birdsBy100NH,
  groupNetHourFlatter,
  dataCreator,
  binner,
  groupBinStatistics,
  flatBinStats,
  groupFlatter,
  groupD3FlatData,
  binNestter,
  stackerD3,
  numericGroups,
  newCreateD3,
  filterStation,
  filterCaptures,
  getEffIds,
} = require("./index");

test("return unique values", () => {
  expect(onlyUnique("a", 0, ["a", "b", "c"])).toBe(true);
});

test("return unique different categories from a variable", () => {
  expect(
    getGroups([{ age: "a" }, { age: "b" }, { age: "a" }], "age")
  ).toStrictEqual(["a", "b"]);
});

test("return object with organized groups, based on categories", () => {
  expect(
    organizeGroups(
      [
        { age: "a", sex: "y" },
        { age: "a", sex: "z" },
        { age: "b", sex: "y" },
      ],
      "age"
    )
  ).toStrictEqual({
    a: [
      { age: "a", sex: "y" },
      { age: "a", sex: "z" },
    ],
    b: [{ age: "b", sex: "y" }],
  });
});

test("creates minimal values of bins based on max value and bin size", () => {
  expect(createBins(20, 5)).toStrictEqual([1, 6, 11, 16]);
});

test("finds which bin the data is from", () => {
  expect(findBin(4, [1, 3, 5, 7])).toStrictEqual(3);
});

test("return the bins from values and bin size", () => {
  expect(getBins([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 1, 3, 3, 5]);
  expect(getBins([6, 22, 51], 7, 365)).toStrictEqual([1, 22, 50]);
});

test("create date values", () => {
  expect(createDate("11/25/2020")).toStrictEqual(new Date("11/25/2020"));
});

test("create julian day from date", () => {
  expect(createJulianDay("1/1/1991")).toStrictEqual(1);
  expect(createJulianDay("2/1/1991")).toBe(32);
  expect(createJulianDay("2/29/2019")).toBe(60);
});

test("create group type based on input", () => {
  expect(createGroupType({ a: "Ava", b: "eita" }, ["a", "b"])).toBe("Ava eita");
});

test("create julian day inside data", () => {
  expect(dataJulianner({ a: "a", date: "01/10/1991" })).toStrictEqual({
    a: "a",
    date: "01/10/1991",
    julian: 10,
  });
});

test("get julian bin inside data", () => {
  expect(dataBinner({ a: "a", julian: 10 }, [1, 7, 12])).toStrictEqual({
    a: "a",
    julian: 10,
    bin: 7,
  });
});

test("create group type from data", () => {
  expect(dataGroupper({ a: "Ava", b: "eita" }, ["a", "b"])).toStrictEqual({
    a: "Ava",
    b: "eita",
    group: "Ava eita",
  });
});

test("create data with necessary variables (julian, bin and group)", () => {
  expect(
    dateCreator(
      { date: "01/01/1991", a: "ava", b: "eita" },
      ["a", "b"],
      [1, 54, 100]
    )
  ).toStrictEqual({
    date: "01/01/1991",
    a: "ava",
    b: "eita",
    group: "ava eita",
    julian: 1,
    bin: 1,
  });
});

test("finds data that belngs to a group", () => {
  expect(
    groupFinder(
      [
        { id: 1, group: "a" },
        { id: 2, group: "b" },
        { id: 3, group: "a" },
      ],
      "a"
    )
  ).toStrictEqual([
    { id: 1, group: "a" },
    { id: 3, group: "a" },
  ]);
});

test("create groups based on group variable", () => {
  expect(
    groupGroupper(
      [
        { id: 1, group: "a" },
        { id: 2, group: "b" },
        { id: 3, group: "a" },
      ],
      ["a", "b"]
    )
  ).toStrictEqual([
    {
      group: "a",
      data: [
        { id: 1, group: "a" },
        { id: 3, group: "a" },
      ],
    },
    { group: "b", data: [{ id: 2, group: "b" }] },
  ]);
});

test("creates a count of bins", () => {
  expect(
    groupBinStatistics(
      [
        { birdnhour: 1, bin: 7 },
        { birdnhour: 2, bin: 5 },
        { birdnhour: 3, bin: 5 },
        { birdnhour: 5, bin: 5 },
      ],
      [5, 7, 9]
    )
  ).toStrictEqual([
    {
      mean: 3.3333333333333335,
      se: 0.8819171036881969,
    },
    {
      mean: 1,
      se: 0,
    },
    {
      mean: 0,
      se: 0,
    },
  ]);
});

test("creates an average and a se array from binned data", () => {
  expect(
    flatBinStats([
      {
        mean: 2.5,
        se: 10,
      },
      {
        mean: 1,
        se: 0,
      },
      {
        mean: 0,
        se: 0,
      },
    ])
  ).toStrictEqual({ mean: [2.5, 1, 0], se: [10, 0, 0] });
});

test("creates mean of a numeric array", () => {
  expect(getMean([1, 2, 3, 4, 5])).toBe(3);
  expect(getMean([])).toBe(0);
});

test("creates standard deviation of a numeric array", () => {
  expect(getStandardDeviation([1, 2, 3, 4, 5])).toBeCloseTo(1.581);
});

test("creates standard error of a numeric array", () => {
  expect(getStandardError([1, 2, 3, 4, 5])).toBeCloseTo(0.707);
  expect(getStandardError([])).toBe(0);
  expect(getStandardError([1])).toBe(0);
});

test("filter items based on variable", () => {
  expect(
    variableFinder(
      [
        { id: 1, test: "a" },
        { id: 2, test: "b" },
        { id: 3, test: "a" },
      ],
      "a",
      "test"
    )
  ).toStrictEqual([
    { id: 1, test: "a" },
    { id: 3, test: "a" },
  ]);
});

test("group items based on variable", () => {
  expect(
    variableGroupper(
      [
        { id: 1, test: "a" },
        { id: 2, test: "b" },
        { id: 3, test: "a" },
      ],
      ["a", "b"],
      "test"
    )
  ).toStrictEqual([
    {
      test: "a",
      data: [
        { id: 1, test: "a" },
        { id: 3, test: "a" },
      ],
    },
    { test: "b", data: [{ id: 2, test: "b" }] },
  ]);
});

test("get effort_id unique values", () => {
  expect(
    getEffortIds([
      { effort_id: 2 },
      { effort_id: 2 },
      { effort_id: 2 },
      { effort_id: 5 },
    ])
  ).toStrictEqual([2, 5]);
});

test("group by effort_id", () => {
  expect(
    groupByEffortId([
      { effort_id: 2, day: 1 },
      { effort_id: 2, day: 2 },
      { effort_id: 2, day: 3 },
      { effort_id: 5, day: 1 },
    ])
  ).toStrictEqual([
    {
      effort_id: 2,
      data: [
        { effort_id: 2, day: 1 },
        { effort_id: 2, day: 2 },
        { effort_id: 2, day: 3 },
      ],
    },
    { effort_id: 5, data: [{ effort_id: 5, day: 1 }] },
  ]);
});

test("add nethours ", () => {
  expect(
    joinNetHours(
      [
        {
          effort_id: 2,
          data: [
            { effort_id: 2, day: 1 },
            { effort_id: 2, day: 2 },
            { effort_id: 2, day: 3 },
          ],
        },
        { effort_id: 5, data: [{ effort_id: 5, day: 1 }] },
      ],
      [
        { effort_id: 2, nethours: 10, date: "11/01/1991" },
        { effort_id: 3, nethours: 20, date: "11/01/1993" },
        { effort_id: 5, nethours: 30, date: "11/01/1992" },
      ]
    )
  ).toStrictEqual([
    {
      nethours: 10,
      date: "11/01/1991",

      effort_id: 2,
      data: [
        { effort_id: 2, day: 1 },
        { effort_id: 2, day: 2 },
        { effort_id: 2, day: 3 },
      ],
    },
    {
      nethours: 30,
      effort_id: 5,
      date: "11/01/1992",
      data: [{ effort_id: 5, day: 1 }],
    },
  ]);
});

test("add nethours ", () => {
  expect(
    groupNetHourFlatter(
      {
        data: [
          { effort_id: 2, day: 1 },
          { effort_id: 2, day: 2 },
          { effort_id: 2, day: 3 },
          { effort_id: 5, day: 1 },
        ],
      },
      [
        { effort_id: 2, nethours: 10, date: "11/01/1991" },
        { effort_id: 3, nethours: 20, date: "11/01/1993" },
        { effort_id: 5, nethours: 30, date: "11/01/1992" },
      ]
    )
  ).toStrictEqual({
    data: [
      {
        nethours: 10,
        date: "11/01/1991",

        effort_id: 2,
        data: [
          { effort_id: 2, day: 1 },
          { effort_id: 2, day: 2 },
          { effort_id: 2, day: 3 },
        ],
      },
      {
        nethours: 30,
        effort_id: 5,
        date: "11/01/1992",
        data: [{ effort_id: 5, day: 1 }],
      },
    ],
  });
});

test("create a birds by 100NH value", () => {
  expect(birdsBy100NH({ nethours: 100, data: [1, 3, 4] })).toBe(3);
});

test("create bin from raw data with date", () => {
  expect(binner({ date: "12/01/1991" }, [1, 10, 20])).toStrictEqual({
    bin: 20,
    date: "12/01/1991",
    julian: 335,
  });
});

test("creat d3 flat from one group data", () => {
  expect(
    groupD3FlatData(
      {
        group: "A",
        data: [
          {
            effort_id: 2,
            julian: 305,
            bin: 30,
            date: "11/01/1991",
            nethours: 10,
            birdnhour: 10,
            data: [{ cloaca: "A", effort_id: 2, group: "A" }],
          },
          {
            effort_id: 3,
            julian: 306,
            bin: 30,
            date: "11/01/1992",
            nethours: 20,
            birdnhour: 10,
            data: [
              { cloaca: "A", effort_id: 3, group: "A" },
              { cloaca: "A", effort_id: 3, group: "A" },
            ],
          },
        ],
      },
      [10, 20, 30]
    )
  ).toStrictEqual([
    { bin: 10, group: "A", mean: 0, se: 0 },
    { bin: 20, group: "A", mean: 0, se: 0 },
    { bin: 30, group: "A", mean: 10, se: 0 },
  ]);
});

test("nest data into bins", () => {
  expect(
    binNestter([
      { bin: 10, group: "A", mean: 0, se: 0 },
      { bin: 20, group: "A", mean: 0, se: 0 },
      { bin: 30, group: "A", mean: 10, se: 0 },
    ])
  ).toStrictEqual([
    {
      key: "10",
      values: [{ bin: 10, group: "A", mean: 0, se: 0 }],
    },
    {
      key: "20",
      values: [{ bin: 20, group: "A", mean: 0, se: 0 }],
    },
    {
      key: "30",
      values: [{ bin: 30, group: "A", mean: 10, se: 0 }],
    },
  ]);
});

test("stack nested data with group", () => {
  expect(
    stackerD3(
      [
        {
          key: "10",
          values: [{ bin: 10, group: "A", mean: 0, se: 0 }],
        },
        {
          key: "20",
          values: [{ bin: 20, group: "A", mean: 0, se: 0 }],
        },
        {
          key: "30",
          values: [{ bin: 30, group: "A", mean: 10, se: 0 }],
        },
      ],
      ["A", "B"]
    )[0][0][0]
  ).toBe(0);

  expect(
    stackerD3(
      [
        {
          key: "10",
          values: [{ bin: 10, group: "A", mean: 0, se: 0 }],
        },
        {
          key: "20",
          values: [{ bin: 20, group: "A", mean: 0, se: 0 }],
        },
        {
          key: "30",
          values: [{ bin: 30, group: "A", mean: 10, se: 0 }],
        },
      ],
      ["A", "B"]
    )[1][2][1]
  ).toBe(10);
});

test("create numeric array with same length of given array", () =>
  expect(numericGroups(["A", "B"])).toStrictEqual([0, 1]));

test("flatten the group data into a dataset with group name ", () => {
  expect(
    groupFlatter(
      [
        {
          group: "A",
          data: [
            {
              effort_id: 2,
              julian: 305,
              bin: 30,
              date: "11/01/1991",
              nethours: 10,
              birdnhour: 10,
              data: [{ cloaca: "A", effort_id: 2, group: "A" }],
            },
            {
              effort_id: 3,
              julian: 306,
              bin: 30,
              date: "11/01/1992",
              nethours: 20,
              birdnhour: 10,
              data: [
                { cloaca: "A", effort_id: 3, group: "A" },
                { cloaca: "A", effort_id: 3, group: "A" },
              ],
            },
          ],
        },

        {
          group: "B",
          data: [
            {
              effort_id: 2,
              julian: 305,
              bin: 30,
              date: "11/01/1991",
              nethours: 10,
              birdnhour: 10,
              data: [{ cloaca: "B", effort_id: 2, group: "B" }],
            },
          ],
        },
      ],
      [10, 20, 30]
    )
  ).toStrictEqual([
    { group: "A", stats: { mean: [0, 0, 10], se: [0, 0, 0] } },
    { group: "B", stats: { mean: [0, 0, 10], se: [0, 0, 0] } },
  ]);
});

// JSON.stringfy necessary here
test("new d3", () => {
  expect(
    JSON.stringify(
      newCreateD3(
        [
          { cloaca: "A", effort_id: 2 },
          { cloaca: "B", effort_id: 2 },
          { cloaca: "A", effort_id: 3 },
          { cloaca: "A", effort_id: 3 },
        ],
        ["cloaca"],
        [
          { effort_id: 2, date: "01/01/1991", nethours: 10 },
          { effort_id: 3, date: "11/01/1992", nethours: 20 },
        ],
        [1, 10, 20, 30]
      )
    )
  ).toStrictEqual(
    JSON.stringify({
      stack: [
        [
          [0, 10],
          [0, 0],
          [0, 0],
          [0, 10],
        ],
        [
          [10, 20],
          [0, 0],
          [0, 0],
          [10, 10],
        ],
      ],
      groups: ["A", "B"],
      flat: [
        { group: "A", bin: 1, mean: 10, se: 0 },
        { group: "B", bin: 1, mean: 10, se: 0 },
        { group: "A", bin: 10, mean: 0, se: 0 },
        { group: "B", bin: 10, mean: 0, se: 0 },
        { group: "A", bin: 20, mean: 0, se: 0 },
        { group: "B", bin: 20, mean: 0, se: 0 },
        { group: "A", bin: 30, mean: 10, se: 0 },
        { group: "B", bin: 30, mean: 0, se: 0 },
      ],
    })
  );
});

test("filter effort by Station", () => {
  expect(
    filterStation(
      [
        { effort_id: 2, station: "HOME" },
        { effort_id: 3, station: "HOME" },
        { effort_id: 4, station: "PARK" },
        { effort_id: 5, station: "PARK" },
      ],
      ["HOME"]
    )
  ).toStrictEqual([
    { effort_id: 2, station: "HOME" },
    { effort_id: 3, station: "HOME" },
  ]);
});

test("extract effort_ids",()=>{
  expect(getEffIds(   [ { effort_id: 2, station: "HOME" },
  { effort_id: 3, station: "HOME" }])).toStrictEqual([2,3])
})


test("filter captures by effort_id",()=>{
  expect(filterCaptures([{effort_id:2,group:"a"},{effort_id:3,group:"c"}],[2])).toStrictEqual([{effort_id:2,group:"a"}])

})

