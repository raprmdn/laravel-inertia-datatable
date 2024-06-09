<?php

namespace App\Http\Controllers;

class ComponentController extends Controller
{
	public function table()
	{
        return inertia('Components/Table/Index');
	}

    public function dataTable()
    {
        return inertia('Components/DataTable/Index');
    }
}
