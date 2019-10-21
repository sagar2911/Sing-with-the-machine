#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 15 13:08:12 2019

@author: amberraza
"""

import xlrd
import json
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('ANEWDataSortable..xlsx')
sh = wb.sheet_by_index(0)
# List to hold dictionaries
words_list = {}
# Iterate through each row in worksheet and fetch values into dict
for rownum in range(1, sh.nrows):
    row_values = sh.row_values(rownum)
    words_list[row_values[0]] = {'valenceMean': row_values[2],
    'valenceSD': row_values[3],
    'arousalMean': row_values[4],
    'arousalSD': row_values[5],
    'dominanceMean': row_values[6],
    'dominanceSD': row_values[7]}
# Serialize the list of dicts to JSON
j = json.dumps(words_list)
# Write to file
with open('data.json', 'w') as f:
    f.write(j)