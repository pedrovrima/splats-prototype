# SPLATs prototype

This is a prototype presented to partners at the Redwoods Science Laboratory and Klamath Bird Observatory to implement a user interface for the SPLATs codebase; 
You can view this prototype at: https://pedrovrima.github.io/splats-prototype/

##  What is SPLATs?

SPLATs is a bird banding data visualization codebase, built originally in R, created to make a better sense of birds demographics. It is run tweaking parameters such as the locations combined or number of days combined to create the plots.

The original codebase required that the users had at least a minimal knowledge of programming and took hours to days to adjust all paremeters and get good enough visualizations.

## How this prototype was built

- React
- D3.js
- TailwindCSS

## How to use

This prototype is built to look at just one species and show a proof of concept that this could actually be built. 

You can create several plot areas to compare between different location combinations. Just scroll to the bottom and click on add a plot.

At the navbar you can select options that will change **all** the plots:

- Groups: If you want to group birds by age and/or sex
- Variables: Select which biological variable will be displayed at the variable plot (see below)
- Collapsers: The radio buttons are used to group the data based on the age (this makes sense for some species and not for others)

At the plot area, below the SPLATs plot (the stacked are plot) you can find first buttons to display extra plots:

- Effort: the amount of effort on each time bin
- Abundance: the total number of birds captured per bin
- Varibale: The plot with the variable chosen at the navbar

*There are bugs at the effort and abundance plot that were ignored since this was just a prototype*

Right under you have butons that will tweak just the this plot area:

- Station: Choose the banding station displayed at the plot
- Bins: Choose the time bins used on the plot
- Regions: Choose group of stations displayed at the plot
- Download: Download a png of the splats plot


** Full program

There is a final version of this, but it uses proprietary data and can be visualized after contacting pedrovrima@gmail.com



