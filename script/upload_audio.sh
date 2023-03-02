# note. To run this script, you will need to have defined playr
# in ~/.ssh/config as the production server to send the data
# e.g.: 

# .ssh/config:
#  Host playr
#    HostName ***
#    User ***

data_dir=`grep AUDIO_DATA_DIR ../.env | cut -d = -f 2 | sed 's/"//g'`
prod_data_dir='/mnt/audio_data'

echo $data_dir
filelist=`ls -1 ${data_dir}/1/`;

for file in $filelist;
  do 
    echo scp ${data_dir}/1/${file} playr:${prod_data_dir}/1/;
    scp ${data_dir}/1/${file} playr:${prod_data_dir}/1/;
done;


