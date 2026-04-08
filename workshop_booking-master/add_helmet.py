#!/usr/bin/env python3
import os
import re

# Define pages that need Helmet and their metadata
pages_to_update = {
    'frontend/src/pages/coordinator/CoordinatorDashboard.jsx': {
        'title': 'Dashboard — FOSSEE Workshop Booking',
        'description': 'View your workshop proposals, manage pending requests, and track workshop statistics. Coordinate with instructors and manage workshop dates.',
    },
    'frontend/src/pages/coordinator/ProposeWorkshopPage.jsx': {
        'title': 'Propose a Workshop — FOSSEE Booking Portal',
        'description': 'Propose a new workshop with FOSSEE. Select workshop type, choose dates, and review terms and conditions.',
    },
    'frontend/src/pages/coordinator/WorkshopStatusPage.jsx': {
        'title': 'My Workshops — FOSSEE Workshop Booking',
        'description': 'View and manage all your proposed workshops. Filter by status to see pending, accepted, or rejected proposals.',
    },
    'frontend/src/pages/instructor/InstructorDashboard.jsx': {
        'title': 'Instructor Dashboard — FOSSEE Workshop Booking',
        'description': 'Manage workshop requests, accept or reject proposals, and view upcoming workshops scheduled for instruction.',
    },
    'frontend/src/pages/instructor/WorkshopManagePage.jsx': {
        'title': 'Manage Workshop — FOSSEE Portal',
        'description': 'Update workshop details, change dates, manage comments, and coordinate with workshop coordinators.',
    },
    'frontend/src/pages/shared/ProfilePage.jsx': {
        'title': 'My Profile — FOSSEE Workshop Booking',
        'description': 'View and edit your profile information including name, institute, department, and role.',
    },
    'frontend/src/pages/shared/WorkshopDetailPage.jsx': {
        'title': 'Workshop Details — FOSSEE Workshop Booking',
        'description': 'View detailed information about a workshop including schedule, instructor, and registration details.',
    },
    'frontend/src/pages/shared/WorkshopTypesPage.jsx': {
        'title': 'Workshop Types — FOSSEE Portal',
        'description': 'Browse available workshop types offered by FOSSEE. Find workshops matching your interests.',
    },
    'frontend/src/pages/NotFoundPage.jsx': {
        'title': '404 — Page Not Found | FOSSEE Workshop Booking',
        'description': 'The page you are looking for does not exist. Return to the main dashboard or explore our workshops.',
    },
}

def add_helmet_to_file(filepath, title, description):
    """Add Helmet import and metadata to a file"""
    base_dir = 'd:\\Projects\\IIT B\\workshop_booking-master\\workshop_booking-master'
    full_path = os.path.join(base_dir, filepath)
    
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        return False
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if Helmet is already imported
    if 'from \'react-helmet-async\'' in content or 'from "react-helmet-async"' in content:
        print(f"Helmet already imported in {filepath}")
        return True
    
    # Add Helmet import after other React/Router imports
    if "import { Helmet } from 'react-helmet-async';" not in content:
        # Find first import statement and insert after React imports
        import_pattern = r"(import React[^\n]*;\n)"
        match = re.search(import_pattern, content)
        if match:
            insert_pos = match.end()
            helmet_import = "import { Helmet } from 'react-helmet-async';\n"
            content = content[:insert_pos] + helmet_import + content[insert_pos:]
    
    # Check if return statement is already wrapped in fragment with Helmet
    if '<Helmet>' in content:
        print(f"Helmet already in JSX for {filepath}")
        return True
    
    # Find return statement and wrap with Helmet
    function_pattern = r'(\s+)return \(\s*(<div|<>)'
    
    def replace_return(match):
        indent = match.group(1)
        opening_tag = match.group(2)
        
        helmet_block = f'''{indent}return (
{indent}  <>
{indent}    <Helmet>
{indent}      <title>{title}</title>
{indent}      <meta name="description" content="{description}" />
{indent}    </Helmet>

{indent}    {opening_tag}'''
        
        return helmet_block
    
    content = re.sub(function_pattern, replace_return, content, count=1)
    
    # Ensure closing fragment if we added Helmet
    if '<Helmet>' in content and '</>' not in content:
        # Find the closing of main return statement
        # Replace the last </div> or </> before final );
        closing_pattern = r'(\s+)(</div>|</>)\s+\)\s*;\s*}(\s*)$'
        
        def replace_closing(match):
            indent = match.group(1)
            original_closing = match.group(2)
            trailing = match.group(3)
            
            if original_closing == '</>':
                # Already a fragment, need to add wrapper
                return f'''{indent}</div>
{indent}    </>
{indent}  );
}}{trailing}'''
            else:
                # It's a div, close it and add fragment close
                return f'''{indent}</div>
{indent}    </>
{indent}  );
}}{trailing}'''
        
        # Try to match and replace
        if re.search(closing_pattern, content, re.MULTILINE):
            content = re.sub(closing_pattern, replace_closing, content, flags=re.MULTILINE)
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated {filepath}")
    return True

# Update all files
for filepath, metadata in pages_to_update.items():
    add_helmet_to_file(filepath, metadata['title'], metadata['description'])

print("\nDone! All pages updated with Helmet metadata.")
