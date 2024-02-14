When should a task or event shown on the summary for a given date?

To be usable and trustworthy, the items in the daily summary need to be:
- focused
- predictable
- stable
- auditable

*Focused* meaning that I only see in the summary for a date items that are relevant to that date
*Predictable* meaning that if you set dates to a task or event, you can expect to find it in the proper dates, even if they are in the future
*Stable* meaning that so long as the data is the same, there should be no changes in the summary. I should be able to go back to a previous date and see a faithful reflection what I had in the summary that day
*Auditable* meaning that I should be able to track when an item was created or edited whenever possible

To the matter of relevance, rules to include an item in the summary for a given date

### events:
Only appear on the date(s) where they happen, even if they happen partially on that date
Examples:
- An event from 2024-10-10 4pm to 2024-10-10 5pm will only be shown on the summary for 2024-10-10
- An event from 2024-10-10 11pm to 2024-10-11 2am will be shown on the summary of both 2024-10-10 and 2024-10-11

### tasks:
completed tasks should appear from the earliest date of relevance until and including the date of completion
Examples:
- A task with start date 2024-10-01 and end date 2024-10-31, completed on 2024-10-15, will only be relevant to the dates between 2024-10-01 up to and including 2024-10-15
- A task with start date 2024-10-01 and end date 2024-10-31, completed on 2024-12-01, will be relevant to the dates between 2024-10-01 up to and including 2024-12-01

uncompleted tasks should appear from the earliest date of relevance until either the end date or today's date (whichever is the latest)

